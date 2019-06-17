// Query module is replacement for the old csbQuery module from Conext Gateway.
//
// Goals:
// 1) Simpler API
// 2) Integrate sysvar formatting & mangling into the query API.
//    - Shouldn't need to call the same formatting functions every time
//      we do a query.
//    - Eliminate need for queryFormatterService, and similar services.
// 3) Robust test coverage to give us confidence when making changes
// 4) Add additional functionality. In the future, we can add:
//    - Retry after first attempt was interrupted because no
//      network connectivity.
//    - Wait for settings change to be applied to downstream
//      devices
//    - Optional sysvars, during sysvar get


// Get sysvars (simple form)
// Provide a flat list of sysvars to retrieve
queryService.getSysvars(['TIMEZONE', 'TIME.LOCAL.ISO_STR']).then(function(data) {
  expect(data.TIMEZONE).toBeDefined();
  expect(data.META.TIMEZONE).toBeDefined();

  // Name mangling happens automatically (dots to underscores)
  expect(data.TIME_LOCAL_ISO_STR).toBeDefined();
  expect(data.META.TIME_LOCAL_ISO_STR).toBeDefined();
});

// Get sysvars (nested object form)
var queryVars = {
  modbus_settings: ['SCB.BUS1.BAUDRATE', 'SCB.BUS1.PARITY'],
  units: ['HMI.IRRADIANCE.UNIT', 'HMI.TEMPERATURE.UNIT'],
}
queryService.getSysvars(queryVars).then(function(data) {
  expect(data.modbus_settings.SCB_BUS1_BAUDRATE).toBeDefined();
  expect(data.modbus_settings.SCB_BUS1_PARITY).toBeDefined();

  // Quality bits
  expect(data.modbus_settings.META.SCB_BUS1_PARITY).toBeDefined();
  // NOTE: queryFormatterService, which this is modeled on,
  // does not create metadata. But it won't hurt anything for
  // metadata to be there.
});

// Get sysvars: Check that all the sysvars we asked for are returned
// in the query.
queryService.getSysvars(['BOGUS']).then(function(data)) {
  // This block won't run. A requested sysvar doesn't exist, so the
  // entire query fails.
}).catch(function(error) {
  // Instead, the error handler will run.
});

// Get sysvars: Disable check for non-existent sysvars
//
// In unit tests, we simulate the results of sysvar queries. We only want to
// provide values for sysvars that are relevant to the test. So it's helpful
// to disable the check for non-existent sysvars.
beforeEach(inject(function(_queryConfigService_) {
  // Instruct queryService not to check for missing sysvars
  spyOn(_queryConfigService_, 'willCheckForMissingSysvars').and.returnValue(false);
}));
getResponder = new SysvarQueryResponder();
getResponder.respondToSysvarQuery([
  {name: 'RELEVANT', value: 'Foo', quality: 'G'},
  // Omit irrelevant sysvars from the simulated response
]);
// Call to getSysvars() is buried several layers deep in the code. The
// unit test doesn't have a way to change which sysvars are requested by
// this call.
queryService.getSysvars(['RELEVANT', 'IRRELEVANT']).then(function(data)) {
  // This sysvar is needed for the code path we're testing
  expect(data.RELEVANT).toBeDefined();

  // This sysvar is only used by code that we're not exercising in this
  // particular test. It doesn't need to be defined.
  expect(data.IRRELEVANT).not.toBeDefined();
});

// TODO: Is there any use for detecting EXTRA sysvars, in addition
// to missing sysvars? Would back-end ever give us sysvars
// we didn't ask for?

// Future enhancement: Optional sysvars
//
// There are some situations where we request a sysvar that hasn't
// been created yet. E.g., immediately after setting the type of
// an unkonwn sensors. We think there might be cases where we want
// to gracefully handle not getting all the sysvars.
//
// This is different than disabling the check during unit tests,
// because this applies to running production code. We'd use this
// when we know that the sysvar server might not have these sysvars.
queryService.getSysvars(['TIMEZONE', 'NEWLY_CREATED_SYSVAR'], {
  optional: ['NEWLY_CREATED_SYSVAR'],
}).then(function(data) {
  // data.NEWLY_CREATED_SYSVAR can be undefined, or it can have a value

  // Non-optional sysvars still need to be present
  expect(data.TIMEZONE).toBeDefined();
});

// Set sysvars (after a get)
//
var queryVars = {
  modbus_settings: ['SCB.BUS1.BAUDRATE', 'SCB.BUS1.PARITY'],
  units: ['HMI.IRRADIANCE.UNIT', 'HMI.TEMPERATURE.UNIT'],
}
var values = queryService.getSysvars(queryVars);
values.modbus_settings.SCB_BUS1_BAUDRATE = 14400;
// values has mangled names (dots replaced with underscores).
// Need to pass in queryVars again so that setSysvars() can
// un-mangle the names.
queryService.setSysvars(values, {queryVars: queryVars});

// By default, all sets are followed by an apply. Suppress
// that with apply: false.
queryService.setSysvars(values, {
  queryVars: queryVars,
  apply: false,
});

// Set sysvars in a particular order
//
// Sorting rules:
// * You don't need to specify every sysvar, just the ones
//   where order matters.
// * Sysvars without a specified order come before ones
//   with a specified order.
// * Sysvars where order is not specified are sorted
//   alphabetically. (So if no order is specified, all are
//   alphabetical.)
queryService.setSysvars(valuesToSet, {
  queryVars: queryVars,
  // Only need to specify the order of the ones that matter
  order: ['SCB.BUS1.PARITY', 'SCB.BUS1.BAUDRATE']
});

// Set sysvars without checking for user authentication
//
// Calls the API endpoint /ns/set
queryService.getSysvars(['LOGIN.ATTEMPTS'], {
  authenticate: false,
})

// Get by tag
var options = {...}; // options available if needed
queryService.getSysvarsByTags(['Combox:Info'], options).then(function(data) {
  expect(data.ETH0_MAC).toBeDefined();
  expect(data.META.ETH0_MAC).toBeDefined();

  // NOTE: Currently, calls to getObjFromScript are used to get sysvars by tag.
  // All calls to that are followed by some kind of object formatting. Some
  // use objectFormatterService, others use deviceObjectFormatterService.
  // The latter is a superset of the former. It appears that device
  // formatting is currently unused in Omnia. If we need that functionality,
  // we can add it as an option.
});

// Call other APIs (data log, reboot, etc.)
var pageType = 'active';
queryService.runScript('/SB/getAlarmWarningInfo', {
    'PageType': pageType,
    'Parameter2': value2,
  }).then(function(data) {
  // Different scripts return data in different formats.
  // Angular magically detects the correct format.
  // Alarm info is plain text.
  expect(typeof data).toBe('string');
})

queryService.runScript('/SB/getDeviceOverviewItems', {
    deviceType: 'Inverter'
  }).then(function(data) {
    // This script returns JSON data
    expect(typeof data).toBe('object');
  });

// TODO: runScript could also accept a format of 'sysvars', to do
name mangling, quality bits, etc. But not sure what the use for that would be.
