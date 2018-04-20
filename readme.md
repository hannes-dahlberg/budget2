# Budget 2

## Core value
The products core value is for a user or a group of user to track and forecast their cash flow, should it be for personal use.

This is NOT an accounting platform. It is not for someone to keep track of their books. It's simply a tool for overseeing an household budget.

## Models

Short description of each model in the system.

### Verification
* Description
* Date
* Period
* ***Transactions***

A verification consist of one or multiple transactions. It concludes a transaction in general sense taking place.

Because a transaction can be split onto multiple accounts these splits are defined as transactions. And instead of having child/parent transactions a verification acts as a parent and transactions as children.

Even though date is defined, a period needs to be set as well (default to date).

Period is defined by year and month (not day)

### Transactions
* Amount
* ***Verification***
* ***Account***

A transaction is simply an amount related to ONE verification and ONE account.

### Accounts
* Name
* ***Parent***
* ***Children***

An account groups multiple transactions and can have multiple children by each child specifying a parent account ID. An account without a parent account is a root account.

### Budget
* Name
* Description
* Sum
* ***Accounts***
* Recurrency
* Start period
* End period

A budget is for planned spending/income/saving. One or multiple accounts are linked to a budget and the recurrency, start- and end period tells over what time to observe transactions on set accounts. The sum of a budget is the sum of all transactions for all specified accounts for the selected recurrency.

### Users
* Email
* Password
* ***Groups***

Someone able to access the system. Visitors can only se landing page / login page.

### Groups
* Name
* ***Owner***
* ***Users***

Each user is part of one or multiple groups. A group is then related to *verifications*, *accounts* and *budget*

Every group has a owner which defines whom has the right to add and remove users to it. Ownership is possible to transfer to another user.

A user is automatically added to a *default* group acting as the user's private group and can only have that user as member. The GUI will present this group as items (verifications, accounts and budget) belonging directly to the user.

### Imports
* Bank
* Account
* Date
* Text
* Amount
* Identifier

The import model is just storage for all imported data to make sure it is not imported multiple times. The identifier is something related to transaction when pulled from the bank. It could either be an ID or something else defining its uniqueness. This is just to prevent the rare occasion when two bank imports have all other properties to be exactly the same.