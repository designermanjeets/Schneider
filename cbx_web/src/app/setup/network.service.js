
"use strict";

/*============================================================================*/
//fn  conext_gatewayNetworkService
/*!

Collection of network service functions

This provides service functions to configure network settings.  Network settings
include LAN, Email, FTP and Cloud Webportal.

@param[in]
  csbQuery
    conext_gateway specific query service functions

@param[in]
  queryService
    General query services.

@param[in]
    queryFormatterService
      Query data formatting service functions.

@param[in]
  $q
    Angular service to handle asynchronous processing.

@param[in]
  $log
    Angular debug log services.

@retval object for all public methods.

*/
/*
REVISION HISTORY:

Version: 1.01  Date: 9-Jan-2018  By: Eddie Leung
  -Added "/SCB/NETWORK/DM0IP", to lan settings.
*/
/*============================================================================*/
angular.module('conext_gateway.setup').factory('gatewayNetworkService', [
  'csbQuery', 'queryService', 'queryFormatterService', '$q', '$log',
  function(csbQuery, queryService, queryFormatterService, $q, $log) {

    var queryVars = {
      lan_settings: ['/SCB/NETWORK/DM0DHCP', 'ETH0/TCPIP/DHCP_IP',
        '/SCB/NETWORK/DM0IPSHOW', 'ETH0/TCPIP/DHCP_NMASK',
        'ETH0/TCPIP/DHCP_GWAY', 'ETH0/TCPIP/DHCP_DNS',
        'HOSTNAME'
      ],
      sftp_settings: ['FTPLOG/ENABLE', 'FTPLOG/DEST_ADDR', 'FTPLOG/USERNAME', 'FTPLOG/DEST_DIR'],
      conext_insight: ['WEBPORTAL/SYNC_ENABLE', 'WEBPORTAL/SYNC_STRING',
        'WEBPORTAL/ENABLE', 'WEBPORTAL/LAST_TRANSFER_TIME',
        'WEBPORTAL/STATUS', 'WEBPORTAL/UNSENT_PACKET_COUNT',
        'ADMIN/DISCLCHECK'
      ],
      remote_diagnostics: ['SESSION/DIAG_ACCESS_CODE', 'SESSION/DIAG_ID',
        'SESSION/DIAG_ACTIVE'
      ],
      ftp_server: ['/SCB/FTP/ENABLE'],
      cloud_settings: ['/SCB/CNM/ENABLED', '/SCB/CNM/PROXY_ENABLED',
        '/SCB/CNM/PROXY_URL', '/SCB/CNM/PROXY_PORT',
        '/SCB/CNM/PROXY_USER', '/SCB/CNM/ALLOW_UPGRADE',
        '/SCB/CNM/ISCONNECTED', '/SCB/CNM/TX_COUNT',
        '/SCB/CNM/RX_COUNT', '/SCB/CNM/TX_ERR_COUNT',
        '/SCB/CNM/LAST_TRANSFER_TIME', '/SCB/LPHD/URN',
        '/SCB/CNM/DISCONNECT_COUNT', 'ADMIN/DISCLCHECK'
      ],
      ap_settings: ['/SCB/AP/SSID',
        '/SCB/AP/ENABLE'
      ]
    };

    var service = {
      getNetworkData: getNetworkData,
      saveLanSettings: saveLanSettings,
      saveSFTPSettings: saveSFTPSettings,
      saveAPSettings: saveAPSettings,
      saveConextInsightSettings: saveConextInsightSettings,
      saveRemoteDiagnostics: saveRemoteDiagnostics,
      setSessionDiagCancel: setSessionDiagCancel,
      saveFTPServer: saveFTPServer,
      saveCloudSettings: saveCloudSettings,
      getStatusSysvars: getStatusSysvars
    };

    return service;

    function getNetworkData() {
      return queryService.getSysvars(queryVars);
    }

    function getStatusSysvars() {
      var stsSysvars = ['/SCB/CNM/ISCONNECTED', 'SESSION/DIAG_ID',
        'SESSION/DIAG_ACTIVE', '/SCB/CNM/TX_COUNT',
        '/SCB/CNM/RX_COUNT', '/SCB/CNM/TX_ERR_COUNT',
        '/SCB/CNM/LAST_TRANSFER_TIME'
      ];
      return queryService.getSysvars(stsSysvars);
    }

    function saveRemoteDiagnostics(data) {
      var requestObject = {};
      requestObject['SESSION/DIAG_ACCESS_CODE'] = data.SESSION_DIAG_ACCESS_CODE;
      return csbQuery.setFromObject(requestObject, true);
    }

    function setSessionDiagCancel() {
      var requestObject = {};
      requestObject['SESSION/DIAG_CANCEL'] = 1;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveLanSettings(data) {
      var requestObject = {};
      requestObject["/SCB/NETWORK/DM0DHCP"] = data.SCB_NETWORK_DM0DHCP;
      if (data.SCB_NETWORK_DM0DHCP === 0) {
        requestObject["/SCB/NETWORK/DM0IP"] = data.ETH0_TCPIP_DHCP_IP;
        requestObject["/SCB/NETWORK/DEFAULTGW"] = data.ETH0_TCPIP_DHCP_GWAY;
        requestObject["/SCB/NETWORK/DM0NETMASK"] = data.ETH0_TCPIP_DHCP_NMASK;
        requestObject["/SCB/NETWORK/DNSSERVER"] = data.ETH0_TCPIP_DHCP_DNS;
      }
      requestObject["HOSTNAME"] = data.HOSTNAME;

      requestObject["/SCB/NETWORK/SET"] = 1;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveAPSettings(data) {
      var requestObject = {};
      requestObject["/SCB/AP/ENABLE"] = data.SCB_AP_ENABLE;
      if (data.SCB_AP_ENABLE !== 0) {
        requestObject["/SCB/AP/SSID"] = data.SCB_AP_SSID;
        if (data.SCB_AP_PASSWORD !== "*****") {
          requestObject["/SCB/AP/PASSWORD"] = data.SCB_AP_PASSWORD;
        }
      }
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveSFTPSettings(data) {
      var requestObject = {};
      requestObject["FTPLOG/ENABLE"] = data.FTPLOG_ENABLE;
      if (data.FTPLOG_ENABLE === 1) {
        requestObject["FTPLOG/DEST_ADDR"] = data.FTPLOG_DEST_ADDR;
        requestObject["FTPLOG/USERNAME"] = data.FTPLOG_USERNAME;
        if (data.FTPLOG_PASSWORD !== "*****") {
          requestObject["FTPLOG/PASSWORD"] = data.FTPLOG_PASSWORD;
        }
        requestObject["FTPLOG/DEST_DIR"] = data.FTPLOG_DEST_DIR;
      }
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveFTPServer(data) {
      var requestObject = {};
      requestObject["/SCB/FTP/ENABLE"] = data.SCB_FTP_ENABLE;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveConextInsightSettings(data) {
      var requestObject = {};
      requestObject["WEBPORTAL/ENABLE"] = data.WEBPORTAL_ENABLE;
      if (data.WEBPORTAL_ENABLE === 1) {
        requestObject["WEBPORTAL/SYNC_ENABLE"] = data.WEBPORTAL_SYNC_ENABLE;
        if (data.WEBPORTAL_SYNC_ENABLE) {
          requestObject["WEBPORTAL/SYNC_STRING"] = data.WEBPORTAL_SYNC_STRING;
        }
      }
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveCloudSettings(data) {
      var requestObject = {};
      requestObject["/SCB/CNM/ENABLED"] = data.SCB_CNM_ENABLED;
      requestObject["/SCB/CNM/PROXY_ENABLED"] = data.SCB_CNM_PROXY_ENABLED;
      if (data.SCB_CNM_PROXY_ENABLED == 1) {
        requestObject["/SCB/CNM/PROXY_URL"] = data.SCB_CNM_PROXY_URL;
        requestObject["/SCB/CNM/PROXY_PORT"] = data.SCB_CNM_PROXY_PORT;
        requestObject["/SCB/CNM/PROXY_USER"] = data.SCB_CNM_PROXY_USER;
        if (data.SCB_CNM_PROXY_PASSWORD !== "*****") {
          requestObject["/SCB/CNM/PROXY_PASSWORD"] = data.SCB_CNM_PROXY_PASSWORD;
        }
      }
      requestObject["/SCB/CNM/ALLOW_UPGRADE"] = data.SCB_CNM_ALLOW_UPGRADE;
      return csbQuery.setFromObject(requestObject, true);
    }
  }
]);
