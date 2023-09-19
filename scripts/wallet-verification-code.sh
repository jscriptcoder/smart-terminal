#!/bin/bash

source .env

mkdir -p static/.well-known

if [ ! -f static/.well-known/walletconnect.txt ]; then
    touch static/.well-known/walletconnect.txt
fi

echo $WALLET_CONNECT_VERIFICATION_CODE > static/.well-known/walletconnect.txt
