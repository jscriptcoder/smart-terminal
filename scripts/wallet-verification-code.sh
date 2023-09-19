#!/bin/bash

source .env

walletconnect_txt="static/.well-known/walletconnect.txt"

mkdir -p static/.well-known

if [ ! -f $walletconnect_txt ]; then
    touch $walletconnect_txt
fi

echo $WALLET_CONNECT_VERIFICATION_CODE > $walletconnect_txt
