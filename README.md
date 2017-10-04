# Air Horn

A sample web app that lets you use your site as an airhorn. 

It demonstrates simple offline usage combined with simple audio looping via web audio.

## Installing

Whilst you don't need to use the build process, if you want to host this publicly it is recommended 
that you optimise all the assets for deployment and as such it is recommended that you run the 
following command in the current working directory:

    npm install

## Building

If you want to run this app locally, you don't have to build the app, the build process is just there
to optimize everything for deployment.

There is a build process that will optimize the images, styles and JS ready for deployment.  To run this
simple execute the following command from the root directory:

    gulp

## Running

There are number of ways to run Airhorner.  The simplest (if you have Python installed) is to
start a simple web server up is to use Python's SimpleHTTPServer.  Run the following:

    cd app && python -m SimpleHTTPServer 3000

This will just load the existing contents of the directory up and it won't support things like live
reload and inline optimizations.  To run the project with optimizations in place and to support live reload
run the following command:

    gulp serve

## License

Copyright 2015 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
