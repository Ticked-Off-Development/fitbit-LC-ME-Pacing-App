function mySettings(props) {
    return (
      <Page>
        <Section
          title={<Text bold>HR Zone Settings</Text>}
          description={<Text>Set the background color mode for HR Zones to solid color (toggle ON) or gradient colors (toggle OFF).</Text>}>
            <Toggle
                settingsKey="colorMode"
                // label="Use Solid Color"
                label={`${props.settings.colorMode === 'true' ? 'ON: Solid Color' : 'OFF: Gradient Colors'}`}
            />
        </Section>
      </Page>
    );
  }
  
  registerSettingsPage(mySettings);
  