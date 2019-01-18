# Deployment to Production

## Overview

`/usr/share/github/small-project` contains a clone of [this GitHub repository](https://github.com/poosd-gang/small-project/tree/master/docs). Running `sudo git pull` will pull in any changes made to the repository (that were committed and then pushed to GitHub's copy of the repo).

**Please don't make crazy changes to the files in `/usr/share/github/small-project`** as this will get really annoying to deal with when pulling in stuff from the GitHub repo. If you do happen to make a change, please `scp` the affected files to your local clone of the repository, commit (please to branch that isn't master), push/pull request/merge. We should try not to have to freshly clone onto the server so often (or ever!).

## How it Works

This is definitely not the way to go for any big project (probably then we would use `docker` and stuff, and not LAMP). But anyway, the folder [/html](/html) is symbolically linked from `/usr/share/github/small-project/html` to `/var/www/html`. So the files in `/usr/share/github/small-project/html` are the ones actually being served.

**Please know** that editing files in both `/var/www/html` and `/usr/share/...` requires `sudo` privileges. Everyone who needs this has it -- really it is only necessary for API/Database development -- and the latter is already done. When it comes time to put the HTML and JavaScript files on the server (not necessary during development stages due to ease of developing locally), @c650 will deal with it.


