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
    OnCompleteAction
)

class Saver(arc4.ARC4Contract):
    def __init__(self) -> None:
        # Declare local state variables to track user's savings goal and balance
        self.user_goal = LocalState(UInt64, description="User's savings goal")
        self.user_balance = LocalState(UInt64, description="User's savings balance")

    # Opt-in logic to initialise local state for users
    @arc4.baremethod(
        allow_actions=["OptIn"],
    )
    def OptIn(self) -> None:
        # Initialise local state when the user opts in for the first time
        self.user_goal[Txn.sender] = UInt64(0)  
        self.user_balance[Txn.sender] = UInt64(0)  

    # Create a saver jar by setting the user's savings goal
    @arc4.abimethod
    def create_saver_jar(self, goal_amount: UInt64) -> None:
        # Set or update the user's goal and reset their balance
        self.user_goal[Txn.sender] = goal_amount
        self.user_balance[Txn.sender] = UInt64(0)

    # Deposit funds into the saver jar
    @arc4.abimethod
    def deposit(self, deposit_txn: gtxn.PaymentTransaction) -> None:
        # Ensure the deposit transaction is sent to the smart contract address
        assert deposit_txn.receiver == Global.current_application_address

        # Update the user's balance with the deposit amount
        self.user_balance[Txn.sender] += deposit_txn.amount

    # Withdraw funds from the saver jar
    @arc4.abimethod
    def withdraw(self) -> None:
        # Retrieve the user's goal and current balance
        user_goal = self.user_goal[Txn.sender]
        user_balance = self.user_balance[Txn.sender]

        # Ensure the user has reached or exceeded their savings goal
        assert user_balance >= user_goal

        # Transfer the user's balance back to their account
        itxn.Payment(
            receiver=Txn.sender,
            amount=user_balance,
        ).submit()

        # Reset the user's balance after withdrawal
        self.user_balance[Txn.sender] = UInt64(0)
