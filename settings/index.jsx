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
          settingsKey="alertInterval"
          min="0"
          max="300"
          step="15"
        />
      </Section>
      <Section
        title={<Text bold>HR Zone Settings</Text>}
        description={<Text>Set the background color mode for HR Zones to solid color (toggle ON) or gradient colors (toggle OFF).</Text>}>
          <Toggle
              settingsKey="colorMode"
              label={`${props.settings.colorMode === 'true' ? 'ON: Solid Color' : 'OFF: Gradient Colors'}`}
          />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
