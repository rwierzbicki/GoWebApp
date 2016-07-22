#!/bin/bash
until ./s; do
	echo "Server crashed with exit code $?. Restarting..." >&2
	sleep 1
done
