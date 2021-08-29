cd ..;
ls | grep lambda-mapping-get- | awk '{ print $1 }' | xargs rm;
cd lambda-mapping-get;
tsc index.ts;
zip -r lambda-mapping-get.zip index.js;
CHECKSUM=$(shasum -a 512 lambda-mapping-get.zip | awk '{ print $1 }');
mv lambda-mapping-get.zip ../lambda-mapping-get-$CHECKSUM.zip;