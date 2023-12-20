# m295_leistungsbeurteilungB
This is the Leistungsbeurteilung-B from Stephan Hagmann for the UeK 295.

## Running the application
1. Clone the repository with this command: `git clone https://github.com/hagmannStephan/m295_leistungsbeurteilungB.git`
2. Run the following commands in your project root directory: `npm install express express-session swagger-ui-express swagger-autogen`
3. Start the application by running this command in your project root directory: `node node task.js`
4. Access the project under the URL `localhost:3000`. If you don't know any endpoints, be sure to check out the documentation as described in the next chapter.

## Swagger-Documentation
Access the link `localhost:3000/documentation` while the application is running to see the swagger-documentation

## Q&A
**What happens if I make an update-request with just one property?** If a property is not in the request, it will stay the same, except for the property "title". It is mandatory in every update because the requirements provided to me said so.