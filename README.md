# Hash Performance test on AWS Lambda
__Native Node v16 Crypto__ _versus_ __CryptoJS__

The Hashing Algorithms:

- MD5
- SHA1
- SHA256
- SHA512
- SHA3
- RIPEMD160

## Running locally
```bash
yarn sls invoke local -c serverless.yml \
    -f perf \
    --app serverless-lambda-crypto
```

## Deploy to AWS
```bash
yarn sls deploy
```