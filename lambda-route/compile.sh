cd ..;
ls | grep lambda-route- | awk '{ print $1 }' | xargs rm;
cd lambda-route;
tsc index.ts;
zip -r lambda-route.zip index.js;
CHECKSUM=$(shasum -a 512 lambda-route.zip | awk '{ print $1 }');
mv lambda-route.zip ../lambda-route-$CHECKSUM.zip;