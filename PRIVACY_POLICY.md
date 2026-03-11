# Privacy Policy — LC ME Pacing

**Last Updated:** March 2, 2026

## Overview

LC ME Pacing is a Fitbit application designed to help people with Long Covid or ME (Myalgic Encephalomyelitis) pace their activity by monitoring heart rate against their Anaerobic Threshold (AT).

## Data We Access

The app accesses the following data through Fitbit OS APIs:

- **Heart Rate** — Real-time heart rate sensor readings used to display your current heart rate and determine your heart rate zone relative to your Anaerobic Threshold.
- **Resting Heart Rate** — Retrieved from your Fitbit user profile to calculate your Anaerobic Threshold using the WorkWell Foundation formula (RHR + 15).
- **Age** — Retrieved from your Fitbit user profile to calculate your Maximum Heart Rate for alternative AT formulas (50%, 55%, or 60% of MHR).

## How Data Is Used

All data is processed **locally on your Fitbit device only**. The app uses your heart rate, resting heart rate, and age solely to:

- Display your current heart rate and heart rate zone
- Calculate your Anaerobic Threshold
- Trigger haptic alerts when your heart rate exceeds your threshold
- Track daily time spent above your Anaerobic Threshold

## Data Storage

- Settings and daily statistics (time above AT, daily exertion budget usage) are stored locally on your Fitbit device in CBOR format.
- Daily statistics reset automatically at midnight each day.
- No data is stored beyond what is on your Fitbit device.

## Data Sharing

**We do not collect, transmit, or share any of your data.** The app operates entirely on-device. No data is sent to external servers, third parties, or the app developer.

## Third-Party Services

This app does not use any third-party analytics, advertising, or data collection services.

## Children's Privacy

This app is not directed at children under 13. It is intended for adults managing Long Covid or ME symptoms.

## Changes to This Policy

If we make changes to this privacy policy, we will update the "Last Updated" date above and publish the revised policy in the app's GitHub repository.

## Contact

If you have questions or concerns about this privacy policy, please open an issue on our GitHub repository:

https://github.com/Ticked-Off-Development/fitbit-LC-ME-Pacing-App/issues
