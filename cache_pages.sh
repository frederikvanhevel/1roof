#!/bin/bash

echo "Start caching!"

urls=$(curl -s "https://1roof.be/sitemap.xml" | grep "<[/]*loc>" | sed -e "s,.*<loc>\([^<]*\)</loc>.*,\1,g")

for url in $urls
do
    echo "Caching $url .."
    curl "$url?_escaped_fragment_=" > /dev/null 2>&1
done

echo "Finished caching!"
