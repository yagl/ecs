ES6 Library seed project
====================
Boilerplate code to build ES6 library projects. When I was looking for alternatives to build a library with ES6, I found some interesting projects that compile for browsers and node, that's amazing, but I just need the node part.

Here you have a boilerplate code to write node only libraries.

How to use it
--------------------
Clone the repository and install dependencies.

    $ git clone https://github.com/abiee/es6-lib-seed.git my-project
    $ cd my-project
    $ npm install

Then you can edit package.json to fit your needs.

Development
--------------------
You can make TDD development by running.

    $ gulp

Will run all your tests and wait for changes, on any changes will run all the tests again.

Build it
--------------------
To build your library for distribution just run.

    $ gulp build

Licence
---------------------
Licensed under the MIT license.
