set QNX_TARGET=C:\qnx660\target\qnx6
set QNX_TARGET=%QNX_TARGET:\=/%
set QNX_HOST=C:\qnx660\host\win32\x86
set QNX_HOST=%QNX_HOST:\=/%
set QNX_CONFIGURATION=C:\qnx660\.qnx
set MAKEFLAGS=-IC:\qnx660\target\qnx6\usr\include
set MAKEFLAGS=%MAKEFLAGS:\=/%
set Path=%HOME%\.scons\site_scons\site_tools;C:\qnx660\host\win32\x86\usr\bin;C:\qnx660\.qnx\bin;C:\qnx660\jre\bin;%Path%
