How to deploy an app to App Store and TestFlight using codemagic.yaml

Codemagic enables you to automatically publish your iOS or macOS app to App Store Connect for beta testing with TestFlight or distributing the app to users via App Store. Codemagic uses the App Store Connect API key for authenticating communication with Apple’s services. You can read more about generating an API key from Apple’s documentation page.
Requirements
Please note that

for App Store Connect publishing, the provided key needs to have App Manager permission,
and in order to submit your iOS application to App Store Connect, it must be code signed with a distribution certificate.
Creating the App Store Connect API key
Signing iOS applications requires Apple Developer Program membership.

It is recommended to create a dedicated App Store Connect API key for Codemagic in App Store Connect. To do so:

Log in to App Store Connect and navigate to Users and Access > Integrations » App Store Connect API.
Click on the + sign to generate a new API key.
Enter the name for the key and select an access level. We recommend choosing App Manager access rights, read more about Apple Developer Program role permissions here.
Click Generate.
As soon as the key is generated, you can see it added to the list of active keys. Click Download API Key to save the private key for later. Note that the key can only be downloaded once.
Take note of the Issuer ID above the table of active keys as well as the Key ID of the generated key as these will be required when setting up the Apple Developer Portal integration in the Codemagic UI.
Setting up publishing to App Store Connect
There are two options for setting up publishing to App Store Connect. You can either connect the Apple Developer Portal integration in the UI and reference the API key name in codemagic.yaml, or add the API key along with the required metadata as environment variables and reference them in your configuration file.
Connect the Apple Developer Portal integration for your team/account
The Apple Developer Portal integration can be enabled in the Team integrations section in your team settings (if you’re a team admin). This allows you to conveniently use the same access credentials for automatic code signing and publishing across different apps and workflows.

In the list of available integrations, click the Connect button for Developer Portal.
In the App Store Connect API key name, provide a name for the key you are going to set up the integration with. This is for identifying the key in Codemagic.
Enter the Issuer ID related to your Apple Developer account. You can find it above the table of active keys on the Integrations tab of the Users and Access page.
Enter the Key ID of the key to be used for code signing.
In the API key field, upload the private API key downloaded from App Store Connect.
Click Save to finish the setup.
If you work with multiple Apple Developer teams, you can add additional keys by clicking Add another key right after adding the first key and repeating the steps described above. You can delete existing keys or add new ones when you click Manage keys next to the Developer Portal integration in personal account or team settings.
Distribution to App Store Connect
The following snippet demonstrates how to authenticate with and upload the IPA to App Store Connect, submit the build to beta tester groups in TestFlight and configure releasing the app to App Store. See additional configuration options for App Store Connect publishing here.

To submit solely to internal testers without requiring Apple’s beta review (TestFlight Internal Testing Only), add the --custom-export-options='{"testFlightInternalTestingOnly": true}' argument to use-profiles during iOS code signing as detailed here.
Note: Please note that you will need to create an app record in App Store Connect before you can automate publishing with Codemagic. It is recommended to upload the very first version of the app manually. Suppose you have set up an app record but have not manually uploaded the app’s first version. In that case, manual configuration of the settings must be done on App Store Connect after the build is complete, such as uploading the required screenshots and providing the values for the privacy policy URL and application category.
# Integration section is required to make use of the keys stored in 
# Codemagic UI under Apple Developer Portal integration.
workflows:
  ios-workflow:
    name: iOS Workflow
    integrations:
      app_store_connect: <App Store Connect API key name>

    environment:
      # ...  

    scripts:
      # ...  

    publishing:
      app_store_connect:
        # Use referenced App Store Connect API key to authenticate binary upload
        auth: integration 

        # Configuration related to TestFlight (optional)

        # Optional boolean, defaults to false. Whether or not to submit the uploaded
        # build to TestFlight beta review.
        # Note: This action is performed during post-processing.
        submit_to_testflight: true

        # Optional boolean, defaults to false. Set to true to automatically expire 
        # previous build in review or waiting for review in Testflight before
        # submitting a new build to beta review. Expired builds will no longer be available for testers.
        # Note: This action is performed during post-processing.
        expire_build_submitted_for_review: true

        # Specify the names of beta tester groups that will get access to the build.
        beta_groups: 
          - group name 1
          - group name 2
        
        # Configuration related to App Store (optional)

        # Optional boolean, defaults to false. Whether or not to submit the uploaded
        # build to App Store review. Note: This action is performed during post-processing.
        submit_to_app_store: true

        # Optional boolean, defaults to false. Set to true to cancel the previous 
        # submission (if applicable) when submitting a new build to App Store review.
        # This allows automatically submitting a new build for review if a previous submission exists.
        # Note: This action is performed during post-processing.
        cancel_previous_submissions: true
        
        # Optional, defaults to MANUAL. Supported values: MANUAL, AFTER_APPROVAL or SCHEDULED
        release_type: SCHEDULED

        # Optional. Timezone-aware ISO8601 timestamp with hour precision when scheduling
        # the release. This can be only used when release type is set to SCHEDULED.
        # It cannot be set to a date in the past.
        earliest_release_date: 2021-12-01T14:00:00+00:00 
        
        # Optional. The name of the person or entity that owns the exclusive rights
        # to your app, preceded by the year the rights were obtained.
        copyright: 2021 Nevercode Ltd

        # Optional boolean. Whether or not to release an App Store version update in phases.
        # With this option turned on, your version update will be released over a 7-day period
        # to a percentage of your users (selected at random by their Apple ID) with automatic
        # updates turned on. Learn more from 
        # https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases.
        # If not specified, then App Store version default phased release configuration is reused.
        phased_release: true
        Note: To use different Apple Developer Portal accounts for publishing your iOS apps, set up separate workflows.
Post-processing of App Store Connect distribution (Magic Actions)
Please note that publishing to App Store Connect through app_specific_password has been deprecated and post-processing actions will not be triggered unless using the new way of publishing as explained above.
Some App Store Connect actions, like submit_to_testflight, beta_groups, cancel_previous_submissions, expire_build_submitted_for_review, and uploading release notes take place asynchronously in the post-processing step after the app artifact has been successfully published to App Store Connect and the main workflow has completed running in Codemagic. This avoids using the macOS build machine while we are waiting for Apple to complete processing the build and it becomes available for further actions.

Post-processing of App Store Distribution jobs, or Magic Actions in short, has a two-step timeout. If the uploaded build cannot be found in App Store Connect in 15 minutes, the step times out. This may happen if there are issues with the uploaded artifact, in which case the build does not become available in App Store Connect at all and you’ll receive an email from App Store Connect. The overall timeout for post-processing is 120 minutes. If the uploaded build has not exited the processing status by then, post-processing is cancelled. You will still be able to manually submit the build to beta review, upload release notes and distribute the app to beta groups once the build becomes available in App Store Connect.

Note that Codemagic does not send status updates on the post-processing step. You can check the build log for the status of post-processing or check your email for updates from App Store Connect.

Post-processing does not consume any build minutes.