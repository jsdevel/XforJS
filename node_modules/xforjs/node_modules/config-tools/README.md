config-tools
============

simple configuration tools for node environments

conventions
===========

config tools expects that your project will follow this format:
``````
$PROJECT_ROOT/ |
               |
               |_____ config/
                            |
                            |______my-config.json
                            |
                            |______app.json
                            
``````                      
Any "*.json$" file within the config directory  can be loaded by config-tools, no matter
where you are within your project.
