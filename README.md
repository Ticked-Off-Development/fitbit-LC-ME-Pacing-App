<p align="center">
  <a href="" rel="noopener">
 <img src="./resources/icon.png" alt="Project logo"></a>
</p>

<h3 align="center">fitbit-lc-me-pacing</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/Ticked-Off-Development/fitbit-LC-ME-Pacing-App/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/Ticked-Off-Development/fitbit-LC-ME-Pacing-App/pulls)
<!-- [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE) -->

</div>

---

<p align="center"> Fitbit clockface application to help people with Long Covid or ME (Myalgic Encephalomyelities) pace according to their Anaerobic Threshold (AT). 
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Supported Devices](#supported_devices)
- [Getting Started](#getting_started)
- [Running Tests](#tests)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](./TODO.md)
- [Contributing](./CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

The LC ME Pacing application plays an alert when the user reaches the target heart rate for Anaerobic Threshold (AT). By default, the alert is set to follow the WorkWell Foundation's guidelines of resting heart rate (RHR) plus 15 beats. Users may choose from various options for AT based on their pacing needs.

## ⌚ Supported Devices <a name = "supported_devices"></a>
- Fitbit Versa 3
- Fitbit Sense 2

## 🏁 Getting Started <a name = "getting_started"></a>

Before you get started, you'll need the following prerequisites to develop apps or clock faces with the Fitbit SDK:

- Fitbit user account. [Sign up here.](https://www.fitbit.com/signup)
- A Fitbit OS device, or the Fitbit OS Simulator for [Windows](https://simulator-updates.fitbit.com/download/stable/win) or [macOS](https://simulator-updates.fitbit.com/download/stable/mac).
- The latest Fitbit mobile application for [Android](http://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile) or [iOS](http://itunes.apple.com/us/app/fitbit-activity-calorie-tracker/id462638897?mt=8&uo=4), paired with your Fitbit OS smartwatch.
- A Windows or Mac computer.
- A wireless network to provide the Fitbit device a connection to the internet.


These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live Fitbit system.
```bash
# Clone the repository
git clone https://github.com/Ticked-Off-Development/fitbit-LC-ME-Pacing-App.git
# Go into the project directory
cd fitbit-LC-ME-Pacing-App

```


### Prerequisites

All you need to get started is [Node.js](https://nodejs.org/en/download/) version 14 on macOS, Windows or Linux.

>Node.js version 14 is recommended. You can install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to easily switch versions of Node.js

```
nvm install 14
nvm alias default 14

# verify the correct version of Node is installed
node --version 
v14.0.0
```


### Installing

A step by step series of examples that tell you how to get a development env running.

Install development dependencies

```
npm install
```
If you are using your Fitbit device, ensure that *Developer Bridge* is enabled and connected. If you are using Fitbit OS Simulator, ensure that it is launched and connected. 

Once you've added the dependencies and connected to a device, you can build and install the project

```
npx fitbit-build
npx fitbit
fitbit$ build
```

You can run the single command `build-and-install` or `bi` for short.
```
fitbit$ bi
```


## 🔧 Running the tests <a name = "tests"></a>

Explain how to run the automated tests for this system.

<!-- https://github.com/ihassin/fitbit-coachusa -->

<!-- ### Break down into end to end tests

Explain what these tests test and why

```
Give an example
``` -->

### Coding style tests

Explain what these tests test and why

```
npm run test
npm run lint
```

## 🎈 Usage <a name="usage"></a>

While wearing the Fitbit watch, run the **LC ME Pacing** application. When the alert goes off for reaching the Anaerobic Threshold (AT), *Stop, Rest, & Pace*.


## 🚀 Deployment <a name = "deployment"></a>

In order to gain access to the developer functionality, you must first login to[ Gallery Admin](https://gam.fitbit.com/), and accept the [Fitbit Platform Terms of Service](https://dev.fitbit.com/legal/platform-terms-of-service/).

After accepting the platform terms of service, you should be able to access the Developer menu within the Fitbit mobile app **(Your device > Developer)**, and the Developer Bridge menu on your device **(Settings > Developer Bridge)**.

To deploy on a live Fitbit watch, ensure the Development Bridge is connected, then build and install the application on the Fitbit command line
```
npx fitbit
fitbit$ connect-phone
fitbit$ bi
```



## ⛏️ Built Using <a name = "built_using"></a>

- [Fitbit OS SDK](https://dev.fitbit.com/) - Software Development Kit
- [Fitbit SDK-CLI](https://dev.fitbit.com/build/guides/command-line-interface/) - Command Line Interface
- [ReactJs](https://react.dev/) - Web Framework for Settings
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@TickedOffCodess](https://github.com/TickedOffCodess) - Idea & Work
See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- [HRM4Pacing](https://www.facebook.com/HRM4Pacing) group members: Thank you for the support and invaluable feedback.
- Hat tip to anyone whose code was used
- Inspiration
- References:
  - https://github.com/Fitbit/sdk-moment
