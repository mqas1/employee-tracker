# Employee Tracker

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

Coding isn't for everyone, and database management *certainly* isn't for everyone.

Yet, being able to access data is crucial to running a business. 

This command line application was created to aid business owners in viewing and managing the departments, roles, and employees in their companies. Employee Tracker makes all the relevant MySQL queries so that business owners don't have to. 

[Video walkthrough](https://drive.google.com/file/d/1gsKOUtvtcE2cqkaysRbdxIEcnKNYRVPb/view) of the application.
  
## Table of Contents
  
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
  
## Installation
  
Run the following command, ```npm i```, to install the required packages.

In the MySQL shell use ```source schema.sql``` and ```source seed.sql``` to create and seed the database, respectively.
  
## Usage
  
The user runs the command ```node index.js``` and answers the prompts. The user inputted data is then used to make database queries through the mysql2 Node.js module. These queries read data from the database or create and update database entries. In future certain delete functionalities will be added.
  
## License
This application is covered under the [MIT License](https://opensource.org/licenses/MIT):
        
        Copyright 2023 mqas1

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
         
## Contributing
  
The guidelines for contributing to this application can be found at the [Contributor Covenant](https://www.contributor-covenant.org/).

---
  
*This README was made with ❤️ by the [README Generator](https://github.com/mqas1/readme-generator)*