These are two tasks that I want to complete as part of my automation testing project.
I want to use Playwright for both the UI and Rest API Automation.
Please note that the UI and API are 2 separate applications and are not related to each other. I will be creating separate test suites for both the UI and API automation tasks, but they both will be part of the same repository. I will be using the Playwright test runner for both the UI and API automation tasks, and I will be following the Page Object Model design pattern for the UI automation task to ensure maintainability and readability of the code. For the API automation task, I will be using a data-driven approach to drive the tests and ensure that they are robust and repeatable. I will also be using assertions with clear and concise descriptions to provide meaningful test results.


Very important note:
Before starting the implementation of code, I will be going through a discovery phase where I will be exploring the functionalities of both the mini Book Store website and the Restful Booker API Endpoints. This will help me understand the requirements and scope of the automation tasks, and allow me to design my test cases effectively. I will also be researching and evaluating different open source test automation frameworks to determine which one best suits my needs for both UI and API automation. Once I have a clear understanding of the requirements and have selected the appropriate tools, I will proceed with the implementation of the automated tests.

Once I have identified the functionalities and requirements for both tasks, I will be creating a Risk Matrix in Confluence using the RBT (Risk Based Testing) approach. This will help me prioritize the test cases based on the risk associated with each functionality, and ensure that I am focusing on the most critical areas of the applications first. The Risk Matrix will be a valuable tool for guiding my testing efforts and ensuring that I am effectively managing the risks associated with both the UI and API automation tasks.
The scenarios identified will be scored and given a RPN (Risk Priority Number) based on the likelihood of occurrence and the impact of the failure. This will help me make informed decisions about which test cases to automate first and which ones may require more manual testing efforts. The Risk Matrix will be a living document that I will update as I progress through the automation tasks, allowing me to continuously assess and manage the risks associated with both applications.

After identifying the scenarios with the highest RPN, I will be creatign a jira Epic/Story/Task for each of the identified scenarios. This will help me organize and track my work effectively, and ensure that I am making progress towards completing the automation tasks. Each Jira issue will include a clear description of the scenario, the expected outcome, and any relevant details or requirements. I will also be linking the Jira issues to the corresponding test cases in my test suite, allowing for easy traceability and management of the testing efforts. This structured approach will help me stay organized and focused as I work through the automation tasks, and ensure that I am delivering high-quality automated tests that meet the requirements of both applications.

The project management tools that I will be using is Atlassian suite - Confluence for Risk Matrix documentation, Jira for ticketing, GitHub for code and version control, and GitHub Actions for Continuous Integration and Continuous Delivery (CI/CD) pipelines. I will be using Confluence to document the Risk Matrix and any other relevant information related to the automation tasks. Jira will be used to create and manage the Epics, Stories, and Tasks for each of the identified scenarios, allowing me to track my progress and ensure that I am meeting deadlines. GitHub will be used to store the code for both the UI and API automation tasks, and I will be using GitHub Actions to set up CI/CD pipelines that will automatically run the tests whenever changes are made to the codebase. This will help me ensure that my tests are always up-to-date and that any issues are caught early in the development process.



Task 1
Web UI Automation
This task refers to the mini Book Store website: https://demoqa.com/books
After reviewing the functionality on the mini Book Store website, you decide that it is possible to automate the 
testing. Your task is to decide on which open source test automation framework to use and develop automated 
tests to reduce manual testing efforts. Feel free to leave out the User Registration from the scope.
Keep in mind, that you are an experienced Quality Engineer and you should be adhering to developing code using 
design pattern(s) and technique(s) to make your code & test data maintainable. You should also be developing 
code that can be tied to Continuous Delivery infrastructure.
If you used AI assistance at any point, note this in your README and briefly describe how you validated the generated code and how it met your quality bar.
We want to see your coding style and the techniques you have selected, so show us what you can do!


Task 2
Rest API Automation
This task refers to the Restful Booker API Endpoints (https://restful-booker.herokuapp.com/).
Part A
Using any API Testing tool of your choice OR if you really prefer, write your own code with any language, and create 
an automated API test suite utilising ALL the endpoints listed on the Restful-Booker API Docs: https://restful-booker.herokuapp.com/apidoc/index.html
The automated API test suite should demonstrate the following features:
• Have a data driven approach using an appropriate data format to drive the tests
• Include both positive and negative test scenarios
• Demonstrate passing of values from one endpoint to another, so the data flows through the endpoints.
• Use of design patterns to create test code that demonstrates maintainability, robustness and repeatability 
as key design considerations
• Provides test results with clear and concise assertion descriptions
Part B
When done, use an AI tool to automate 1 endpoint. Include the Output in your repo and annotate it with any corrections or improvements you made



I would like you to start with Task 1 - Web UI Automation discovery phase first. 
Please visit the page: https://demoqa.com/books and explore the functionalities of the mini Book Store website. If this task can be done using better using Playwright MCP server, please let me know and help me setup the Playwright MCP server.
Once you complete exploring the website, come-up with various scenarios and their effor and risk score to create a Risk Matrix in Confluence using the RBT (Risk Based Testing) approach. we will then score the RPN and then create Jira issues. 
We will do so using JIRA MCP server, so please help me setup the JIRA MCP server as well after that. 
Ask me question along the way and let me know if you need any help or more information to complete the tasks.
