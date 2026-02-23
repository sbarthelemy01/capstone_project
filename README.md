# Capstone Step 1 - Project Ideas

## 1. Trip Tracker
* Problem: Users may want to know when a flight may be available at a low price, but they're not checking the airline(s) frequently to see when the ticket is at the desired price.
* Solution: Create an app or website that collects data from major airlines and alerts the user when the price (specified by user and includes any price below that) the user is looking for is available. The airline websites are checked every hour, and the program would notify the user by email (if it’s a website) or with a pop-up notification (if it’s an app that will serve as a desktop widget).
  
## 2. Food Tracker/Weight Management App
* Problem: Individuals looking to lose weight lack a single, reliable source for an appropriate meal plan and accurate caloric intake. The abundance of conflicting and inconsistent information across different websites makes it difficult for people to determine an accurate weight loss plan.
* Solution: Create a website that accounts for the user’s age, weight, sex, etc. and give an accurate plan with some useful tips for the user to lose weight.
  
## 3. Info Map
* Problem: Users may need to view data concerning current global issues in a larger scope. That would require them to sift through multiple websites to gather their information.
* Solution: Data would be presented in the form of an info map. Users can view statistics for each country by hovering over the country of their choice. If the user may need more information about a certain issue in a country, the country selected will contain links to direct the user to different websites.


# Capstone Step 2 - Project Proposal
I will focus on the InfoMap idea. Here is the [link](https://drive.google.com/file/d/1NbVWbb327IHjFWf0NgBD8SJ0ewIAlYEP/view?usp=sharing) to the second step of the project.


# Capstone Step 3 - Frontend Specifications
Below is a breakdown of the InfoMap user flow. The application enables users to search for and select countries filtered by specific global issues. Additionally, the app includes integrated checks for account registration and profile management.

<img width="800" height="529" alt="capstone_step3" src="https://github.com/user-attachments/assets/56267dca-54a1-416c-bf52-170f400fe0ea" />


# Capstone Step 4 - Database Model
Attached is a database model that demonstrates the relationships between the tables. The most important models are “Countries” and “Global_Issues.” A country can have multiple challenges that are considered global concerns. For the selected global issue, statistical information will be available for many countries. The “Users” table contains information about the current registered users within the application. It stores their names, usernames, and passwords. Users can access data and add multiple bookmarks to their “Saved_Searches.”

<img width="538" height="700" alt="capstone_step4" src="https://github.com/user-attachments/assets/c0febf79-8b6e-4c32-aafa-4879bd79c030" />
