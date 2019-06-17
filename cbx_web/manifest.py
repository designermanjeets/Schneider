#!/usr/bin/python
import azuretools

# a manifest format should be:
manifest = [
                {'name' : 'activevents', 'version' :'v0.1'},
                {'name' : 'aescrypt', 'version' :'v0.1' } ,
                {'name' : 'aescrypt_keygen', 'version' :'v0.1' } ,
                {'name' : 'comtrade', 'version' :'v0.1' } ,
                {'name' : 'curves', 'version' :'v0.1' } ,
                {'name' : 'datareports', 'version' :'v0.1' } ,
                {'name' : 'devcan', 'version' :'v0.1.1' } ,
                {'name' : 'discovery', 'version' :'v0.1' } ,
                {'name' : 'discoveryserver', 'version' :'v0.1' } ,
                {'name' : 'dlog_fcgi', 'version' :'v0.1' } ,
                {'name' : 'dnp3server', 'version' :'v0.1.1' } ,
                {'name' : 'dpws', 'version' :'v0.1' } ,
                {'name' : 'etherios', 'version' :'v0.1' } ,
                {'name' : 'events', 'version' :'v0.1' } ,
                {'name' : 'evtmgr', 'version' :'v0.3' },
                {'name' : 'evtmgrtest', 'version' :'v0.1' } ,
                {'name' : 'execvars', 'version' :'v0.1' } ,
                {'name' : 'faults', 'version' :'v0.1' } ,
                {'name' : 'file_fcgi', 'version' :'v0.1' } ,
                {'name' : 'filevars', 'version' :'v0.1' } ,
                {'name' : 'hrt', 'version' :'v0.1' } ,
                {'name' : 'invcli', 'version' :'v0.1.1' } ,
                {'name' : 'invdisp', 'version' :'v0.1' } ,
                {'name' : 'invdisptest', 'version' :'v0.1' } ,
                {'name' : 'invmon', 'version' :'v0.2.2' } ,
                {'name' : 'iocontroller', 'version' :'v0.1' } ,
                {'name' : 'lib_svdatetime.so', 'version' :'v0.1' } ,
                {'name' : 'libcfu.so', 'version' :'v0.1' } ,
                {'name' : 'libdnp3targ.a', 'version' :'v0.1' } ,
                {'name' : 'libdpwscore.a', 'version' :'v0.1' } ,
                {'name' : 'libdynvars.a', 'version' :'v0.1' } ,
                {'name' : 'libevtmgr.so', 'version' :'v0.2' },
                {'name' : 'libexpat.so', 'version' :'v0.1' } ,
                {'name' : 'libfcgi.so', 'version' :'v0.1' } ,
                {'name' : 'libfilerenderer.a', 'version' :'v0.1' } ,
                {'name' : 'libfreemodbustcp.a', 'version' :'v0.1' } ,
                {'name' : 'libhal.a', 'version' :'v0.1.1' } ,
                {'name' : 'libinvapi.a', 'version' :'v0.1' } ,
                {'name' : 'libipc.a', 'version' :'v0.1' } ,
                {'name' : 'libj1939.a', 'version' :'v0.1.1' } ,
                {'name' : 'liblber.so', 'version' :'v0.1' } ,
                {'name' : 'libldap.so', 'version' :'v0.1' } ,
                {'name' : 'liblighttpd.so', 'version' :'v0.1' } ,
                {'name' : 'liblua.so', 'version' :'v0.1' } ,
                {'name' : 'libluasec.so', 'version' :'v0.1' } ,
                {'name' : 'libluasession.so', 'version' :'v0.1' } ,
                {'name' : 'libluasocket.so', 'version' :'v0.1' } ,
                {'name' : 'libluasys.so', 'version' :'v0.2' } ,
                {'name' : 'libmbmaster.a', 'version' :'v0.1' } ,
                {'name' : 'libmd5.a', 'version' :'v0.1' } ,
                {'name' : 'libmime.so', 'version' :'v0.1' } ,
                {'name' : 'libmod_auth.so', 'version' :'v0.1' } ,
                {'name' : 'libpaintstring.so', 'version' :'v0.1'},
                {'name' : 'libpcre.so', 'version' :'v0.1' } ,
                {'name' : 'libpermissions.so', 'version' :'v0.1' } ,
                {'name' : 'libqdecoder.so', 'version' :'v0.1' } ,
                {'name' : 'librenderbuffer.so', 'version' :'v0.1' } ,
                {'name' : 'libse1can.a', 'version' :'v0.1.1' } ,
                {'name' : 'libsession.so', 'version' :'v0.1' } ,
                {'name' : 'libsysvars.so', 'version' :'v0.4' } ,
                {'name' : 'libvalidate.so', 'version' :'v0.1' } ,
                {'name' : 'lighttpd', 'version' :'v0.1' } ,
                {'name' : 'load', 'version' :'v0.1' } ,
                {'name' : 'lua', 'version' :'v0.1' } ,
                {'name' : 'magnet', 'version' :'v0.1' } ,
                {'name' : 'mbmclient', 'version' :'v0.3' } ,
                {'name' : 'mbserver', 'version' :'v0.1' } ,
                {'name' : 'mcdupload', 'version' :'v0.1' } ,
                {'name' : 'md5', 'version' :'v0.1' } ,
                {'name' : 'mod_access.so', 'version' :'v0.1' } ,
                {'name' : 'mod_accesslog.so', 'version' :'v0.1' } ,
                {'name' : 'mod_alias.so', 'version' :'v0.1' } ,
                {'name' : 'mod_auth.so', 'version' :'v0.1' } ,
                {'name' : 'mod_cgi.so', 'version' :'v0.1' } ,
                {'name' : 'mod_cml.so', 'version' :'v0.1' } ,
                {'name' : 'mod_cml_funcs.so', 'version' :'v0.1' } ,
                {'name' : 'mod_cml_lua.so', 'version' :'v0.1' } ,
                {'name' : 'mod_compress.so', 'version' :'v0.1' } ,
                {'name' : 'mod_dirlisting.so', 'version' :'v0.1' } ,
                {'name' : 'mod_evasive.so', 'version' :'v0.1' } ,
                {'name' : 'mod_evhost.so', 'version' :'v0.1' } ,
                {'name' : 'mod_expire.so', 'version' :'v0.1' } ,
                {'name' : 'mod_extforward.so', 'version' :'v0.1' } ,
                {'name' : 'mod_fastcgi.so', 'version' :'v0.1' } ,
                {'name' : 'mod_flv_streaming.so', 'version' :'v0.1' } ,
                {'name' : 'mod_indexfile.so', 'version' :'v0.1' } ,
                {'name' : 'mod_magnet.so', 'version' :'v0.1' } ,
                {'name' : 'mod_magnet_cache.so', 'version' :'v0.1' } ,
                {'name' : 'mod_mysql_vhost.so', 'version' :'v0.1' } ,
                {'name' : 'mod_proxy.so', 'version' :'v0.1' } ,
                {'name' : 'mod_redirect.so', 'version' :'v0.1' } ,
                {'name' : 'mod_rewrite.so', 'version' :'v0.1' } ,
                {'name' : 'mod_rrdtool.so', 'version' :'v0.1' } ,
                {'name' : 'mod_scgi.so', 'version' :'v0.1' } ,
                {'name' : 'mod_secure_download.so', 'version' :'v0.1' } ,
                {'name' : 'mod_setenv.so', 'version' :'v0.1' } ,
                {'name' : 'mod_simple_vhost.so', 'version' :'v0.1' } ,
                {'name' : 'mod_skeleton.so', 'version' :'v0.1' } ,
                {'name' : 'mod_ssi.so', 'version' :'v0.1' } ,
                {'name' : 'mod_staticfile.so', 'version' :'v0.1' } ,
                {'name' : 'mod_status.so', 'version' :'v0.1' } ,
                {'name' : 'mod_trigger_b4_dl.so', 'version' :'v0.1' } ,
                {'name' : 'mod_userdir.so', 'version' :'v0.1' } ,
                {'name' : 'mod_usertrack.so', 'version' :'v0.1' } ,
                {'name' : 'mod_webdav.so', 'version' :'v0.1' } ,
                {'name' : 'netcat', 'version' :'v0.1' } ,
                {'name' : 'ns_fcgi', 'version' :'v0.1' } ,
                {'name' : 'pcregrep', 'version' :'v0.1' } ,
                {'name' : 'permissionstools', 'version' :'v0.1' } ,
                {'name' : 'quploadfile', 'version' :'v0.1' } ,
                {'name' : 'redis-benchmark', 'version' :'v0.1' } ,
                {'name' : 'redis-check-aof', 'version' :'v0.1' } ,
                {'name' : 'redis-check-dump', 'version' :'v0.1' } ,
                {'name' : 'redis-cli', 'version' :'v0.1' } ,
                {'name' : 'redis-sentinel', 'version' :'v0.1' } ,
                {'name' : 'redis-server', 'version' :'v0.1' } ,
                {'name' : 'render', 'version' :'v0.1' } ,
                {'name' : 'rsync', 'version' :'v0.1' } ,
                {'name' : 'save', 'version' :'v0.1' } ,
                {'name' : 'ser485', 'version' :'v0.1' } ,
                {'name' : 'sessionserver', 'version' :'v0.4' } ,
                {'name' : 'slinger', 'version' :'v0.1' } ,
                {'name' : 'spawn-fcgi', 'version' :'v0.1' } ,
                {'name' : 'stunnel', 'version' :'v0.1' } ,
                {'name' : 'svalias', 'version' :'v0.1' } ,
                {'name' : 'svflags', 'version' :'v0.1' } ,
                {'name' : 'svget', 'version' :'v0.1' } ,
                {'name' : 'svset', 'version' :'v0.1' } ,
                {'name' : 'syslogd', 'version' :'v0.1' } ,
                {'name' : 'sysmap', 'version' :'v0.1' } ,
                {'name' : 'sysvarserver', 'version' :'v0.4' } ,
                {'name' : 'sysvartest', 'version' :'v0.4' } ,
                {'name' : 'tag', 'version' :'v0.1' } ,
                {'name' : 'thttpd', 'version' :'v0.1' } ,
                {'name' : 'tinyfcgi', 'version' :'v0.1' } ,
                {'name' : 'trigger', 'version' :'v0.1' } ,
                {'name' : 'usermgt_fcgi', 'version' :'v0.2' } ,
                {'name' : 'varcreate', 'version' :'v0.1' } ,
                {'name' : 'vars', 'version' :'v0.1'},
                {'name' : 'vars_fcgi', 'version' :'v0.4' } ,
                {'name' : 'www.zip', 'version' :'v0.1'},
                {'name' : 'xpath', 'version' :'v0.1'},
                ]
