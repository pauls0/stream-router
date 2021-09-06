cd ..;
ls | grep lambda-mapping-set- | awk '{ print $1 }' | xargs rm;
cd lambda-mapping-set;
tsc index.ts;
zip -r lambda-mapping-set.zip index.js;
CHECKSUM=$(shasum -a 512 lambda-mapping-set.zip | awk '{ print $1 }');
mv lambda-mapping-set.zip ../lambda-mapping-set-$CHECKSUM.zip;