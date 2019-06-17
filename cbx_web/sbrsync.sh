#!/bin/sh
#===================================================================================
#
#  FILE:  sbrsync.sh
#
#  USAGE:  ./sbrsync.sh ip_address
#          ip_address - Destination device IP address, e.g  10.167.91.93
#
#  DESCRIPTION: Use the rsync to copy files that are different.  This is used for
#               Web HMI development only
#
#  REQUIREMENTS: Change the file system to read/write using the following command:-
#                   mount -o remount,rw /hd0t177 /
#                See Confluence page "Building and Developing the HMI" for details.
#
#  AUTHOR:    Eddie Leung
#  COMPANY:   Schneider Electric
#  VERSION:   1.0
#  CREATED:   Jan 8, 2018
#  REVISION:  Jan 8, 2018
#
#===================================================================================

#Device IP Address input  xx.xx.xx.xx
IP=10.167.91.3
USER=factory
HMIDIR="/var/www/newhmi/"

if [ ! $1 = "" ]
then
  IP=$1
fi

if [ ! $2 = "" ]
then
  USER=$2
  HMIDIR="/var/www/hmi/"
fi
#Copy HMI files to device
rsync -a --progress --human-readable www/hmi/ $USER@$IP:$HMIDIR
