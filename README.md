Demo code for a simple but scalable approach to state management with Native Web Components. 

Source code for [video: State Management concepts with Native Web Component in 200s](https://youtu.be/PXT4b7YCVVE)

## Install & Run

```sh
# Clone the base code to your folder
git clone git@github.com:jeremychone-channel/s01e05-client-state-management.git  my-frontend-project/

cd my-frontend-project/

# make it yours
rm -Rf .git

# install the dependencies
npm install

# build and start REPL development 
npm run watch

# (should open http://localhost:8888/index.html in your default browser)
```

## Start coding

After `npm run watch` for **live coding**: 

- `pcss/main.pcss` and its imports gets recompiled as `dist/app-bundle.pcss`
- `src/**/*.ts ` files get re-compiled as `dist/app-bundle.js`
- `design.sketch` if present and if has sketch installed, generates `svg/sprite.svg` and `pcss.var-colors.pcss`


## Coding approach

Based on minimalistic but scalable DOM Native approach to build small to big web frontend applications.

> Technology: [Typescript](https://www.typescriptlang.org/) | [postcss](https://postcss.org/) | [rollup](https://rollupjs.org/) | [native web components](https://developers.google.com/web/fundamentals/web-components/) |  [dom-native library (<7kb gzip, < 17 min.js)](https://www.npmjs.com/package/dom-native)

> THE DOM IS THE FRAMEWORK - ZERO IE TAX | ZERO VIRTUAL DOM | ZERO FRAMEWORK
