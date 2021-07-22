# extension-ui

`extension-ui` forms the core UI for all extension webviews. It is based on [React with Carbon Design System]

#### Development

Change to `extension-ui` folder

```
$ cd extension-ui
```

Install dependencies

```
$ npm install
```

#### Running locally

Start the development server by running below command. This will open up a browser with http://localhost:\<port-number>, `<port-number>` is auto assigned

```
$ npm run start
```

[comment]: <Below are the list of links>
[react with carbon design system]: https://react.carbondesignsystem.com/

#### Development with `extension-client`

Before you can run vscode extesnion , `extension-ui` needs to be built and copied to `dist/` folder. In order to do that run the below commands from the project root

To build `extension-ui`,

```
$ npm run ui:build
```

To copy the built `extension-ui`

```
$ npm run ui:copy
```
