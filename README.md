# Game of Life

## Introduction

### History and rules of the game

The Game of Life was invented in 1970 by the British mathematician John Horton Conway and it is played on a rectangular/squared grid and consist of selecting cells in tiles in order to draw a certain pattern on the grid, that corresponds to a initial state.

Assuming that only a cell can live in a tile, the state of the grid evolves through time steps following a few rules:

- each cell in a tile with no cells or only one cell in the contiguos tiles dies from *loneliness*,
- each cell in a tile with four or more cells in the contiguos tiles dies from *overpopulation*,
- each cell in a tile with two or three cells in the contiguos tiles survives,
- each empty tile becomes populated if it has exactly three cells in its contiguos tiles.

The next state is determinated applying **simultaneosly** all the previous rules in parallel.

The game simply consists of selecting some tile to populate to define an initial state; then starting the simulation the user can observe the evolution of the "life" on the grid.

### Angular

[Angular](https://angular.io/) is a [Typescript](https://www.typescriptlang.org/) framework to build web applications that implements the pattern [*Model-View-ViewModel* (MVVM)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) pattern.

In a nutshell, in the MVVM pattern:

- the **View**  defines *what the user sees* on the screen, thus layout and appereances and has a *two-way-binding* of properties with the **ViewModel**,
- the **ViewModel** provide an abstraction of the View, exposing properties and defining some logic to apply in response to some event(e.g. a user interaction and/or a value change in a binded property),
- finally,  the **Model** can refers, according to the circumstances, to the domain model or to the data access layer.

With reference to the MVVM pattern, in Angular a web application is essentially defined by a collection of *components*; each component is related to a particular page or element of the page and consists of three parts:

- a Typecript file that defines properties and methods (***ViewModel***),
- a HTML template, that defines the graphical layout of the components, enriched with some one-way or/and two-way references to properties and methods defined in the Typescript files (***View***),
- a **(S)CSS** or **SASS** file that defines styling rules for the HTML elements defined in the template(***View***).

The ***Model*** in Angular is essentially played by some user-defined class referenced in the components Typescript files or/and by the components themselves.

## Exam-related informations

All the requirements listed in the assignement text are satistied; the application also implements the *cell history* **extra** feature.

## Installation

 Clone the repository and serve the content inside the `/dist/game-of-life` folder with a software web server of your choice.
 As an example, you can use [http-server](https://www.npmjs.com/package/http-server) (requires [Node.js](https://nodejs.org/en/) installed) using the following commands to install and run it:

    npm install --global http-server
    http-server your_path_to_dist_folder/dist/game-of-life --port 8080 -c-1

Now `http-server` is listening incoming HTTP traffic from `localhost:8080`.

## Usage

Open a browser at the address `localhost:8080` (see [Installation](###Installation)), click on some tiles, press play and enjoy the game!

You can also:

- pause the simulation,
- go forward step by step,
- set the speed of the simulation,
- reset the global state,
- see the life time (in number of steps) of each tile evolving during the simulation (**BONUS FEATURE**).

## Implementation

The logic of the game and the GUI to control the state evolution of the grid is implemented as a <strong>single-page web application</strong> with the framework [Angular](https://angular.io/) using graphic elements by [Angular Material](https://material.angular.io/).
The GUI is optimized for a desktop-size view and shows a grid of 20x20 tiles and some controls to play, pause, move forward and set the framerate of the simulation.


### Guide into the code

In this section you can find a brief explanation of the structure of source code and the role played by the elements within.

Inside the `src` folder there are:

- a folder named `app` that contains the core of the application:
  - a subfolder named `components` in which we can find, beyond a **toolbar** component with has only a stylistic function,  a **grid** component and a **controller** component; all of them are combined in the main component named `AppComponent` that is referred in the entry point `index.html` with the tag `<app-root>`;
  - a subfolder named `model` that contains two classes `Simulation` and `Tile` and an enumeration `TileState` used in the grid and controller components;
  - `AppModule` defines the component to show when the user open the browser in the `boostrap` section, collects all the defined components in the `declarations` section and maintains a list of the external modules in the `imports` section;

- an `environments` folder with two files `environments.ts` and `environments.prod.ts` to define, respectively, some logic for the development mode and the production mode ( in this case their only purpose is to set a boolean);
- the `main.ts` file is needed to enable the production mode and for browser support; also `polyfills.ts` and `browserlist` are needed to support multiple browsers;
- in `styles.scss` you can find general style rules that affects the whole application graphic layout;
- in `angular.json` you can find internal Angular settings;
- in `package.json` the developer can specify the dependencies and the development dependencies of the applycation; these are more automatically extended in the `package-lock.json` (intented to be read-only);
- finally, `ts***.json` are files to define Typescript linting rules.
