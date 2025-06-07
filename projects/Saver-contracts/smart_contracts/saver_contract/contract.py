'''
Saver Smart Contract

This contract allows users to set personal savings goals, deposit funds, 
and withdraw their savings once they meet or exceed their goals. Each user's 
savings goal and balance are tracked individually in local state.

Features:
- Users can opt in to initialise their savings goal and balance.
- Users can set or update their savings goal at any time.
- Deposits are tracked and credited to the user's balance.
- Withdrawals are allowed only if the user's balance meets or exceeds their goal.

Example Workflow:
1. A user opts into the contract to initialise their local state.
2. The user sets a savings goal using the `create_saver_jar` method.
3. The user deposits funds using the `deposit` method.
4. Once the user's balance meets or exceeds their goal, they can withdraw their savings using the `withdraw` method.
'''
from algopy import (
    Global,
    Txn,
    arc4,
    UInt64,
    LocalState,
    itxn,
    gtxn,
    OnCompleteAction,
    GlobalState,
)

class Saver(arc4.ARC4Contract):
    def __init__(self) -> None:
        # Core user savings state
        self.user_goal = LocalState(UInt64, description="User's savings goal")
        self.user_balance = LocalState(UInt64, description="User's savings balance")
        self.user_withdraw_count = LocalState(UInt64, description="Number of times user completed savings goal")

        # Analytics & history
        self.total_saved = LocalState(UInt64, description="Lifetime total ALGO deposited by user")
        self.last_user_goal = LocalState(UInt64, description="Previous goal before latest one")
        self.last_withdrawn = LocalState(UInt64, description="Last amount withdrawn")
        self.last_withdraw_time = LocalState(UInt64, description="Timestamp of last withdrawal")
        self.highest_goal_achieved = LocalState(UInt64, description="Highest savings goal achieved")
        self.average_deposit_amount = LocalState(UInt64, description="Running average of deposit amounts")

        # Internal counter for deposit count (used to calculate average)
        self.deposit_count = LocalState(UInt64, description="Number of deposits made")

    @arc4.baremethod(allow_actions=["OptIn"])
    def OptIn(self) -> None:
        self.user_goal[Txn.sender] = UInt64(0)
        self.user_balance[Txn.sender] = UInt64(0)
        self.user_withdraw_count[Txn.sender] = UInt64(0)

        # Initialize tracking vars
        self.total_saved[Txn.sender] = UInt64(0)
        self.last_user_goal[Txn.sender] = UInt64(0)
        self.last_withdrawn[Txn.sender] = UInt64(0)
        self.last_withdraw_time[Txn.sender] = UInt64(0)
        self.highest_goal_achieved[Txn.sender] = UInt64(0)
        self.average_deposit_amount[Txn.sender] = UInt64(0)
        self.deposit_count[Txn.sender] = UInt64(0)

    @arc4.abimethod
    def create_saver_jar(self, goal_amount: UInt64) -> None:
        self.last_user_goal[Txn.sender] = self.user_goal[Txn.sender]
        self.user_goal[Txn.sender] = goal_amount
        self.user_balance[Txn.sender] = UInt64(0)

    @arc4.abimethod
    def deposit(self, deposit_txn: gtxn.PaymentTransaction) -> None:
        assert deposit_txn.receiver == Global.current_application_address

        self.user_balance[Txn.sender] += deposit_txn.amount
        self.total_saved[Txn.sender] += deposit_txn.amount

        # Update deposit count
        self.deposit_count[Txn.sender] += UInt64(1)

        # Update average deposit amount
        total_saved = self.total_saved[Txn.sender]
        count = self.deposit_count[Txn.sender]
        self.average_deposit_amount[Txn.sender] = total_saved // count
        
    @arc4.abimethod
    def withdraw(self) -> None:
        user_goal = self.user_goal[Txn.sender]
        user_balance = self.user_balance[Txn.sender]
        assert user_balance >= user_goal

        self.user_withdraw_count[Txn.sender] += UInt64(1)
        self.last_withdrawn[Txn.sender] = user_balance
        self.last_withdraw_time[Txn.sender] = Global.latest_timestamp

        if user_goal > self.highest_goal_achieved[Txn.sender]:
            self.highest_goal_achieved[Txn.sender] = user_goal

        itxn.Payment(
            receiver=Txn.sender,
            amount=user_balance,
        ).submit()

        self.user_balance[Txn.sender] = UInt64(0)
