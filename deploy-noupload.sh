STACK_NAME="stream-router"
TEMPLATE="cloudformation-template.yml"
# PARAMETERS_FILE="cloudformation-perameters.json"
# PARAMS=($(jq -r '.Parameters[] | [.ParameterKey, .ParameterValue] | "\(.[0])=\(.[1])"' ${PARAMETERS_FILE}))
#     --parameter-overrides ${PARAMS[@]}
lambdaroute=$(ls | grep lambda-route- | awk '{ print $1 }');
lambdamappingget=$(ls | grep lambda-mapping-get- | awk '{ print $1 }');
lambdamappingset=$(ls | grep lambda-mapping-set- | awk '{ print $1 }');

# aws s3 cp ${lambdaroute} s3://stream-router-dependancies/;
# aws s3 cp ${lambdamappingget} s3://stream-router-dependancies/;
# aws s3 cp ${lambdamappingset} s3://stream-router-dependancies/;

aws cloudformation deploy \
    --template-file "${TEMPLATE}" \
    --stack-name "${STACK_NAME}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
      AdminConsoleRepository="https://github.com/pauls0/stream-router" \
      AdminConsoleBranch="main" \
      AdminConsoleOauthToken=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 \
      BucketDepenancies="stream-router-dependancies" \
      LambdaRouteCodeUriKey="${lambdaroute}" \
      LambdaMappingGetCodeUriKey="${lambdamappingget}" \
      LambdaMappingSetCodeUriKey="${lambdamappingset}" \
