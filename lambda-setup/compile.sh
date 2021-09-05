cd ..;
ls | grep lambda-setup- | awk '{ print $1 }' | xargs rm;
cd lambda-setup;
tsc index.ts;
zip -r lambda-setup.zip index.js;
CHECKSUM=$(shasum -a 512 lambda-setup.zip | awk '{ print $1 }');
mv lambda-setup.zip ../lambda-setup-$CHECKSUM.zip;