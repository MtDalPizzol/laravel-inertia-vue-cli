# Integrate Laravel and Inertia.js with a Vue CLI app

> This repository is the result of an article I published at [DEV Community](https://dev.to/mtdalpizzol/integrate-laravel-inertia-js-with-a-vue-cli-app-32ac) which is replicated below. If this is useful to you, make sure to [follow me there](https://dev.to/mtdalpizzol).

## How to use this repo

Clone this repo, install the dependencies and serve your assets through Vue CLI. Then, go to your Laravel app address (Eg.: `http://laravel-inertia-vue-cli.localhost`)

> **DON'T FORGET TO CREATE YOUR `resources/.env.local` FILE AND SET THE VUE_APP_ASSET_URL ENVIRONMENT VARIABLE.** Eg.: `VUE_APP_ASSET_URL=http://localhost:8080/`

```bash
composer install
cd resources
npm install
npm run serve
```

## What is Inertia.js

[Inertia.js](https://inertiajs.com/)  was invented to integrate backend frameworks Like [Laravel](https://www.laravel.com) and [Rails](https://rubyonrails.org/) with modern frontend frameworks like [React](https://pt-br.reactjs.org/), [Vue](https://vuejs.org/) and [Svelte](https://svelte.dev/) and building SPAs without the need for a backend API nor a client-side router. I became a fan of the project and I'm using it with Vue.js.

## Why do we need this tutorial though?

Now, if you blindly follow the instructions at [Inertia's client-side setup page](https://inertiajs.com/client-side-setup), you'll find that it only covers its installation with [Code Splitting](https://webpack.js.org/guides/code-splitting/) enabled using [Laravel Mix](https://laravel-mix.com/). Although I'm a Jeffrey Way (the author of Laravel Mix) fan - I'm still subscribed at [Laracasts](https://www.laracasts.com), he's learning platform - and I understand the intent of Laravel Mix, my experience with it is that when it comes to advanced usage, you'll quickly find yourself wasting days (yes, I had that experience), fighting Webpack configurations and finding out that the problems come down to multiple outdated dependencies and stuff like that.

On the other hand, [Vue CLI](https://cli.vuejs.org) always made my life easier. I have absolutely nothing bad to say about it. Everything always works as expected (at least for me, at least until now).

So, I wanted to **use Inertia.js with a Vue CLI** app.

## Heads up

Now, this article will be short and easy, but this is because we already did the heavy lifting in a previews article on **[how to integrate Laravel with a Vue CLI app with Hot Module Replacement](https://dev.to/mtdalpizzol/integrate-laravel-and-vue-cli-app-with-hot-module-replacement-and-no-backend-api-4h76)**. If you missed that, go ahead and follow that step by step until you get to the **Routing** section. Feel free to read that section there, if you want, but it's not a requirement for this tutorial.

## Setting up the client-side

Install Inertia.js adapter for Vue.js:

```bash
cd resources
npm install @inertiajs/inertia @inertiajs/inertia-vue
cd ../
```

Create a page component at `resources/src/pages`:

```bash
mkdir resources/src/pages
nano resources/src/pages/Home.vue
```

```html
// resources/src/pages/Home.vue

<template>
  <h1>Hello from Home</h1>
</template>

<script>
export default {}
</script>
```

Edit your `main.js` file to use the Inertia App component and to load page components from the proper directory:

```javascript
// resources/src/main.js

import Vue from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue'

Vue.config.productionTip = false

Vue.use(plugin)

const el = document.getElementById('app')

new Vue({
  render: h => h(App, {
    props: {
      initialPage: JSON.parse(el.dataset.page),
      resolveComponent: name => import('@/pages/' + name + '.vue').then(module => module.default)
    }
  })
}).$mount(el)
```

Edit `resources/src/template.blade.php` replacing `<div id="app"></div>` with the `@inertia` Blade directive:

```html
<!-- ... -->
<body>
  <!-- ... -->
  @inertia
  <!-- built files will be auto injected -->
</body>
```

## Setting up the server-side

Install Inertia's server side adapter:

```bash
composer require inertiajs/inertia-laravel
```

Publish and register the Inertia middleware:

```bash
php artisan inertia:middleware
```

```php
// app/Http/Kernel.php

'web' => [
    // ...
    \App\Http\Middleware\HandleInertiaRequests::class,
],
```

Create a configuration file for Inertia based on the contents of the [config file on the official repo](https://github.com/inertiajs/inertia-laravel/blob/master/config/inertia.php) and set `page_paths` properly:

```bash
nano config/inertia.php
```

```php
// config/inertia.php

return [

    /*
    |--------------------------------------------------------------------------
    | Inertia
    |--------------------------------------------------------------------------
    |
    | The values described here are used to locate Inertia components on the
    | filesystem. For instance, when using `assertInertia`, the assertion
    | attempts to locate the component as a file relative to any of the
    | paths AND with any of the extensions specified here.
    |
    */

    'testing' => [      
        'ensure_pages_exist' => true,
        'page_paths' => [
            resource_path('src/pages'),
        ],
        'page_extensions' => [
            'js',
            'svelte',
            'ts',
            'vue',
        ],
    ],
];
```

## Setup a route and you're good to go

```php
// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});
```

And that's it!

## Conclusion

As you can see, we're not locked up with Laravel Mix in order to use Inertia.js. With some efort we can use Inertia.js in conjunction with a Vue CLI app.

IMO, this is the best setup I've ever worked with in almost 14 years working with web development. What do you think? Hope you enjoy it as much as I do. Cheers!