/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/react-in-jsx-scope */
function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold>Alert Settings</Text>}
        description={<Text>Set the interval at which the alert should play when heart rate is above the anaerobic threshold (AT).</Text>}
      >
        <Slider
          label={`Alert Interval: ${props.settings.alertInterval || 0} seconds`}
          settingsKey='alertInterval'
          min='0'
          max='300'
          step='15'
        />
      </Section>
      <Section
        title={<Text bold>Alert Type</Text>}
        description={<Text>Set the alert type.</Text>}
      >
        <Select
          selectViewTitle='Select Alert Type'
          label='Alert Type'
          settingsKey='alertType'
          options={[
            { name: 'Alert', value: 'alert' },
            { name: 'Bump', value: 'bump' },
            { name: 'Confirmation', value: 'confirmation' },
            { name: 'Confirmation Max', value: 'confirmation-max' },
            { name: 'Nudge', value: 'nudge' },
            { name: 'Nudge Max', value: 'nudge-max' },
            { name: 'Ping', value: 'ping' },
            { name: 'Ring', value: 'ring' }
          ]}
          />
        {}
      </Section>
      <Section
        title={<Text bold>Anaerobic Threshold (AT) Settings</Text>}
        description={<Text>Set the Anaerobic Threshold (AT) formula.</Text>}>
          <Select
            selectViewTitle='Select AT formula'
            label={'AT based on '}
            settingsKey='atFormula'
            options={[
              { name: 'MaxHR x 50%', value: 'maxHR50' },
              { name: 'MaxHR x 55%', value: 'maxHR55' },
              { name: 'MaxHR x 60%', value: 'maxHR60' },
              { name: 'Workwell RHR + 15', value: 'workwell' },
              { name: 'Custom AT', value: 'custom' }
            ]}
            />
            {JSON.parse(props.settings.atFormula).values[0].value === 'custom' ? <TextInput label='Custom AT' settingsKey='customAT' type='number'/> : null}
          {}
      </Section>
      <Section
        title={<Text bold>HR Zone Background Settings</Text>}
        description={<Text>Set the background color mode for HR Zones to solid color (toggle ON) or gradient colors (toggle OFF).</Text>}>
          <Toggle
              settingsKey='colorMode'
              label={`${props.settings.colorMode === 'true' ? 'ON: Solid Color' : 'OFF: Gradient Colors'}`}
          />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
