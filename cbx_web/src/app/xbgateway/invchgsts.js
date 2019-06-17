"use strict";

angular.module('conext_gateway.xbgateway').factory('invChgStsService',
  ['$log',
  function ($log) {
    var service = {
      GetInvSts       : GetInvSts,
      GetChgSts       : GetChgSts,
      GenState        : GenState,
      AGSState        : AGSState,
      GenOnReason     : GenOnReason,
      GenOffReason    : GenOffReason
    };

    function SourceByAssociation( ac_assoc ) {
        var ac_source = 'unknown';
        if( ( ac_assoc >= 19 ) && ( ac_assoc <= 34 ) ) {
            ac_source = 'AGS';
        } else if ( ac_assoc > 2 ) {
            ac_source = 'grid';
        } else {
            /* no change to energy source */
        }

        return ac_source;
    }

    function ACSource( data ) {
        var ac_assoc = 0;
        if( ( data.AC_XFER_SW_OP_STATE === 801 ) ||
            ( data.AC_XFER_SW_OP_STATE === 803 ) )
        {
            ac_assoc = data.ASSOC_CFG_AC_INPUT_OUTPUT;
        }
        else if( ( data.AC_XFER_SW_OP_STATE === 802 ) ||
                 ( data.AC_XFER_SW_OP_STATE === 804 ) )
        {
            ac_assoc = data.ASSOC_CFG_AC_INPUT;
        }

        return SourceByAssociation( ac_assoc );
    }

    function GenOnReason( reason_code )
    {
        var reason = 'xanbus.gen_on_reason.not_on';

        switch( reason_code ) {
            case 0: /* Not on */
                reason = 'xanbus.gen_on_reason.not_on';
                break;

            case 1: /* DC Voltage Low */
                reason = 'xanbus.gen_on_reason.dc_voltage_low';
                break;

            case 2: /* Battery SOC Low */
                reason = 'xanbus.gen_on_reason.battery_soc_low';
                break;

            case 3: /* AC Current High */
                reason = 'xanbus.gen_on_reason.ac_current_high';
                break;

            case 4: /* Contact Closed */
                reason = 'xanbus.gen_on_reason.contact_closed';
                break;

            case 5: /* Manual On */
                reason = 'xanbus.gen_on_reason.manual_on';
                break;

            case 6: /* Exercise */
                reason = 'xanbus.gen_on_reason.exercise';
                break;

            case 7: /* Non Quiet Time */
                reason = 'xanbus.gen_on_reason.non_quiet_time';
                break;

            case 8: /* Ext On via AGS */
                reason = 'xanbus.gen_on_reason.ext_on_via_ags';
                break;

            case 9: /* Ext On via GEN */
                reason = 'xanbus.gen_on_reason.ext_on_via_gen';
                break;

            case 10: /* Unable to Stop */
                reason = 'xanbus.gen_on_reason.unable_to_stop';
                break;

            case 11: /* AC Power High */
                reason = 'xanbus.gen_on_reason.ac_power_high';
                break;

            case 12: /* DC Current High */
                reason = 'xanbus.gen_on_reason.dc_current_high';
                break;

            default:
                break;

        }

        return reason;
    }

    function GenOffReason( reason_code ) {
        var reason = 'xanbus.gen_off_reason.not_off';

        switch( reason_code ) {
            case 0: /* Not Off */
                reason = 'xanbus.gen_off_reason.not_off';
                break;

            case 1: /* DC Voltage High */
                reason = 'xanbus.gen_off_reason.dc_voltage_high';
                break;

            case 2: /* Battery SOC High */
                reason = 'xanbus.gen_off_reason.battery_soc_high';
                break;

            case 3: /* AC Current Low */
                reason = 'xanbus.gen_off_reason.ac_current_low';
                break;

            case 4: /* Contact Opened */
                reason = 'xanbus.gen_off_reason.contact_opened';
                break;

            case 5: /* Reached Absorp */
                reason = 'xanbus.gen_off_reason.reached_absorp';
                break;

            case 6: /* Reached Float */
                reason = 'xanbus.gen_off_reason.reached_float';
                break;

            case 7: /* Manual Off */
                reason = 'xanbus.gen_off_reason.manual_off';
                break;

            case 8: /* Max Run Time */
                reason = 'xanbus.gen_off_reason.max_run_time';
                break;

            case 9: /* Max Auto Cycle */
                reason = 'xanbus.gen_off_reason.max_auto_cycle';
                break;

            case 10: /* Exercise Done */
                reason = 'xanbus.gen_off_reason.exercise_done';
                break;

            case 11: /* Quiet Time */
                reason = 'xanbus.gen_off_reason.quiet_time';
                break;

            case 12: /* Ext Off via AGS */
                reason = 'xanbus.gen_off_reason.ext_off_via_ags';
                break;

            case 13: /* Safe Mode */
                reason = 'xanbus.gen_off_reason.safe_mode';
                break;

            case 14: /* Ext Off via GEN */
                reason = 'xanbus.gen_off_reason.ext_off_via_gen';
                break;

            case 15: /* Ext Shutdown */
                reason = 'xanbus.gen_off_reason.ext_shutdown';
                break;

            case 16: /* Auto Off */
                reason = 'xanbus.gen_off_reason.auto_off';
                break;

            case 17: /* Fault */
                reason = 'xanbus.gen_off_reason.fault';
                break;

            case 18: /* Unable To Start */
                reason = 'xanbus.gen_off_reason.unable_to_start';
                break;

            case 19: /* Power Low */
                reason = 'xanbus.gen_off_reason.power_low';
                break;

            case 20: /* DC Current Low */
                reason = 'xanbus.gen_off_reason.dc_current_low';
                break;

            case 21: /* AC Good */
                reason = 'xanbus.gen_off_reason.ac_good';
                break;

            default:
                break;
        }

        return reason;
    }

    function AGSState( state ) {
        var ags_state = 'xanbus.agsstate.not_operating';

        switch( state ) {
            case 0: /* Quiet Time */
                ags_state = 'xanbus.agsstate.quiet_time';
                break;
            case 1:
                ags_state = 'xanbus.agsstate.auto_on';
                break;
            case 2:
                ags_state = 'xanbus.agsstate.auto_off';
                break;
            case 3:
                ags_state = 'xanbus.agsstate.manual_on';
                break;
            case 4:
                ags_state = 'xanbus.agsstate.manual_off';
                break;
            case 5:
                ags_state = 'xanbus.agsstate.gen_shutdown';
                break;
            case 6:
                ags_state = 'xanbus.agsstate.ext_shutdown';
                break;
            case 7:
                ags_state = 'xanbus.agsstate.ags_fault';
                break;
            case 8:
                ags_state = 'xanbus.agsstate.suspend';
                break;
            case 9:
                ags_state = 'xanbus.agsstate.not_operating';
                break;
            default:
                break;
        }

        return ags_state;
    }

    function GenState( state ) {
        var gen_state = 'xanbus.genstate.stopped';

        switch( state ) {
            case 0: /* preheating */
                gen_state = 'xanbus.genstate.preheating';
                break;
            case 1: /* Start Delay */
                gen_state = 'xanbus.genstate.start_delay';
                break;
            case 2: /* Cranking */
                gen_state = 'xanbus.genstate.cranking';
                break;
            case 3: /* Starter Cooling */
                gen_state = 'xanbus.genstate.starter_cooling';
                break;
            case 4: /* Warming Up */
                gen_state = 'xanbus.genstate.warming_up';
                break;
            case 5: /* Cooling Down */
                gen_state = 'xanbus.genstate.cooling_down';
                break;
            case 6: /* Spinning Down */
                gen_state = 'xanbus.genstate.spinning_down';
                break;
            case 7: /* Shutdown Bypass */
                gen_state = 'xanbus.genstate.shutdown_bypass';
                break;
            case 8: /* Stopping */
                gen_state = 'xanbus.genstate.stopping';
                break;
            case 9: /* Running */
                gen_state = 'xanbus.genstate.running';
                break;
            case 10: /* Stopped */
                gen_state = 'xanbus.genstate.stopped';
                break;
            case 11: /* Crank Delay */
                gen_state = 'xanbus.genstate.crank_delay';
                break;
            default:
                break;
        }

        return gen_state;
    }

    function GetInvSts( data ) {
        var energySource = '';
        var energyTarget = '';
        var description = '';
        var inverting = false;

        energyTarget = 'load';

        switch( data.INV_STS ) {
            case 1024: /* invert */
                energySource = 'battery';
                energyTarget = 'load';
                description = 'xanbus.invsts.Invert';
                inverting = true;
                break;

            case 1025: /* AC Passthrough */
                energySource = ACSource(data);
                energyTarget = 'load';
                description = 'xanbus.invsts.ACPassThrough';
                break;

            case 1026: /* APS Only */
                description = 'xanbus.invsts.APSOnly';
                break;

            case 1027: /* load sense */
                energySource = 'battery';
                energyTarget = 'load';
                description = 'xanbus.invsts.LoadSense';
                inverting = true;
                break;

            case 1028: /* inverter disabled */
                description = 'xanbus.invsts.InverterDisabled';
                break;

            case 1029: /* load sense ready */
                energySource = 'battery';
                energyTarget = 'load';
                description = 'xanbus.invsts.LoadSenseReady';
                inverting = true;
                break;

            case 1030: /* Engaging inverter */
                energySource = 'battery';
                energyTarget = 'load';
                description = 'xanbus.invsts.EngagingInverter';
                inverting = true;
                break;

            case 1031:
                description = 'xanbus.invsts.InverterDisabled';
                break;

            case 1032:
                description = 'xanbus.invsts.InverterStandby';
                break;

            case 1033: /* Grid Tied */
                energySource = 'battery';
                energyTarget = ACSource(data);
                description = 'xanbus.invsts.GridTied';
                inverting = true;
                break;

            case 1034: /* Grid Support */
                energySource = 'battery';
                energyTarget = ACSource(data);
                description = 'xanbus.invsts.GridSupport';
                inverting = true;
                break;

            case 1035: /* Gen Support */
                energySource = 'battery';
                energyTarget = ACSource(data);
                description = 'xanbus.invsts.GenSupport';
                inverting = true;
                break;

            case 1036: /* Sell to Grid */
                energySource = 'battery';
                energyTarget = ACSource(data);
                description = 'xanbus.invsts.SellToGrid';
                inverting = true;
                break;

            case 1037: /* Load Shaving */
                energySource = 'battery';
                energyTarget = ACSource(data);
                description = 'xanbus.invsts.LoadShaving';
                inverting = true;
                break;

            case 1038: /* Grid Frequency Stabilization */
                energySource = 'battery';
                energyTarget = ACSource( data );
                description = 'xanbus.invsts.GridFrequencyStabilization';
                inverting = true;
                break;

            case 1039: /* AC Coupling */
                energySource = ACSource( data );
                energyTarget = 'load';
                description = 'xanbus.invsts.ACCoupling';
                break;

            case 1040: /* Reverse Ibatt */
                description = 'xanbus.invsts.ReverseIBatt';
                break;

            default:
                break;
        }

        return {
            inverting : inverting,
            energySource : energySource,
            energyTarget : energyTarget,
            description : description }
    }

    function GetChgSts( data ) {
        var charging = false;
        var energySource = '';
        var energyTarget = '';
        var description = '';

        switch( data.CHG_STS ) {
            case 768: /* Not charging */
                description = 'xanbus.chgsts.NotCharging';
                break;

            case 769: /* bulk */
                charging = true;
                description = 'xanbus.chgsts.Bulk';
                break;

            case 770: /* Absorption */
                charging = true;
                description = 'xanbus.chgsts.Absorption';
                break;

            case 771: /* Overcharge */
                charging = true;
                description = 'xanbus.chgsts.Overcharge';
                break;

            case 772: /* Equalize */
                charging = true;
                description = 'xanbus.chgsts.Equalize';
                break;

            case 773: /* Float */
                charging = true;
                description = 'xanbus.chgsts.Float';
                break;

            case 774: /* No Float */
                charging = true;
                description = 'xanbus.chgsts.NoFloat';
                break;

            case 775: /* Constant VI */
                charging = true;
                description = 'xanbus.chgsts.ConstantVI';
                break;

            case 776: /* Charger Disabled */
                description = 'xanbus.chgsts.ChargerDisabled';
                break;

            case 777: /* Qualifying AC */
                description = 'xanbus.chgsts.QualifyingAC';
                break;

            case 778: /* Qualifying APS */
                description = 'xanbus.chgsts.QualifyingAPS';
                break;

            case 779: /* Engaging Charger */
                charging = true;
                description = 'xanbus.chgsts.EngagingCharger';
                break;

            case 780: /* Charge Fault */
                description = 'xanbus.chgsts.ChargeFault';
                break;

            case 781: /* Charger Suspend */
                description = 'xanbus.chgsts.ChargerSuspend';
                break;

            case 782: /* AC Good */
                description = 'xanbus.chgsts.ACGood';
                break;

            case 783: /* APS Good */
                description = 'xanbus.chgsts.APSGood';
                break;

            case 784: /* AC Fault */
                description = 'xanbus.chgsts.ACFault';
                break;

            case 785: /* Charge */
                charging = true;
                description = 'xanbus.chgsts.Charge';
                break;

            case 786: /* Absorption Exit Pending */
                charging = true;
                description = 'xanbus.chgsts.AbsorptionExitPending';
                break;

            case 787: /* Ground Fault */
                description = 'xanbus.chgsts.GroundFault';
                break;

            case 788: /* AC Good Pending */
                description = 'xanbus.chgsts.ACGoodPending';
                break;

            default:
                description = 'xanbus.chgsts.unknown';
                break;
        }

        energySource = ACSource( data );
        energyTarget = 'battery';

        return {
            charging : charging,
            energySource : energySource,
            energyTarget : energyTarget,
            description : description }
    }

    return service;
  }
]);
