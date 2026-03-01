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
          step='5'
        />
      </Section>
      <Section
        title={<Text bold>Alert Mute Duration</Text>}
        description={<Text>Set the duration to mute alerts after manually dismissing.</Text>}
      >
        <Slider
          label={`Mute Duration: ${props.settings.muteDuration || 5} minutes`}
          settingsKey='muteDuration'
          min='1'
          max='60'
          step='1'
        />
      </Section>
      <Section
        title={<Text bold>Alert (Haptic) Type</Text>}
        description={<Text>Set the haptic alert type.</Text>}
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
              { name: 'Workwell RHR + 15', value: 'workwell' },
              { name: 'MaxHR x 50%', value: 'maxHR50' },
              { name: 'MaxHR x 55%', value: 'maxHR55' },
              { name: 'MaxHR x 60%', value: 'maxHR60' },
              { name: 'Custom AT', value: 'custom' }
            ]}
            />
            {props.settings.atFormula && JSON.parse(props.settings.atFormula).values && JSON.parse(props.settings.atFormula).values[0] && JSON.parse(props.settings.atFormula).values[0].value === 'custom' ? <TextInput label='Custom AT' settingsKey='customAT' type='number'/> : null}
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
      <Section
        title={<Text bold>Daily Exertion Budget</Text>}
        description={<Text>Set the maximum number of minutes above AT per day. A warning will trigger when approaching this limit.</Text>}>
          <Slider
            label={`Daily Budget: ${props.settings.dailyBudget || 30} minutes`}
            settingsKey='dailyBudget'
            min='5'
            max='120'
            step='5'
          />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
