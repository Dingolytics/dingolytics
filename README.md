Dingolytics
===========

This is a Dingolytics web UI application.

We build Dingolytics to help getting started with end-to-end data management
from day one of project development cycle.

Our tech stack includes:

- ClickHouse as a main data storage
- Vector as a data ingestion tool
- Dingolytics API and web UI applications

We provide management layer for ClickHouse and Vector to make integration
easier and quicker to set up.

Share your feedback and ask questions!

- Issues: [https://github.com/Dingolytics/dingolytics/issues](dingolytics/issues)
- Telegram: [https://t.me/dingolytics_community](https://t.me/dingolytics_community)
- Slack: (coming soon)


Features
--------

- Integrated ClickHouse database and Vector data collector
- Data streams configuration with automated tables creation
- Vector ingestion paths based on HTTP/HTTPS
- Built-in standard schemas for logs and application events
- Web based SQL query editor with syntax highlighting and autocomplete
- Parameterized queries with JSON output and SVG widgets


Documentation
-------------

- Deployment, self-hosted: [dingolytics-selfhosted](https://github.com/Dingolytics/dingolytics-selfhosted)
- Web SDK for application events tracking: [dingolytics-sdk-web](https://github.com/Dingolytics/dingolytics-sdk-web)

But also keep in mind that we are in the early stage of development and the documentation is mostly missing.


Development
-----------

You'll need to start [back-end](https://github.com/Dingolytics/dingolytics-backend) first to start development.

Then you can start the front-end with:

```bash
yarn install
yarn start
```


Credits to Redash
-----------------

Thanks to all the contributors to Redash! Please check the [`credits`](./credits/) folder.


License
-------

This repository contains a forked version of Redash, which is licensed under the BSD-2-Clause license (check the "LICENSE.redash" file).

This forked repository includes modifications made by Dingolytics team after commit [ad7d30f](https://github.com/getredash/redash/tree/ad7d30f91de64a291eb89892c713bd0067c47ecc),
which are licensed under the Apache License, Version 2.0.

Dingolytics team:

- Alexey Kinev <https://github.com/rudyryk>
- Ekaterina Ponomarenko <https://github.com/alesten-code>