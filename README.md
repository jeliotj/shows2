# KBMF Show Recording App

This app creates an internal scheduler using the Spinitron Calendar as the
single source of truth. We use the Spinitron API to get calendar data and
update a local database. Changes to the db trigger an update to scheduled jobs.
