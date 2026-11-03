# YCLIENTS booking and analytics

The home page opens the hosted YCLIENTS form in a responsive dialog. No local time slots or Telegram submission are used by the new UI. The iframe mounts only when opened and is discarded on close so reopening fetches the form again. The static service catalogue remains independently maintained; service buttons open the general form, without pretending that a local service index is a YCLIENTS service ID.

The legacy booking API returns 410 and no longer reads or writes local appointments. Existing database records are not deleted.

Form: https://n2289117.yclients.ru/
Metrika counter: 114052429. Webvisor is disabled.

## Required account setup before advertising

1. In Metrika create a JavaScript event goal named `booking_open`. This is an opening, NEVER a completed appointment.
2. In YCLIENTS open Integrations → Analytics → Yandex Metrika → Connect → I already have a counter. Enter 114052429, select booking form 2289117 and connect it.
3. Configure the successful-booking goal according to the events supplied by that integration. Do not infer success from an iframe load or a button click. Inspect the actual emitted event before defining the goal; do not add a second success emitter on the website.
4. Confirm that Metrika's allowed addresses include lanaknyzeva.ru and the actual form hostname after redirects. A domain filter must not reject the booking events.
5. Test a tagged campaign link, complete an authorized test appointment, verify one appointment in YCLIENTS and one successful-booking conversion in Metrika with the expected attribution. Cancel the test appointment afterward.

## Release checks

- Build and type-check the app; verify that site buttons open the form on desktop and mobile, including from the service dialog and mobile menu.
- Check close/reopen, keyboard focus, mobile keyboard, scroll, slow connections and blocked frame resources. The separate-page link is a manual fallback, not the default flow.
- Confirm service, employee and available-time selection against YCLIENTS. Verify changes made in YCLIENTS are reflected when the form reloads.
- Verify that an ordinary visit is not counted twice and opening the form does not count as a successful booking.
- YCLIENTS explicitly does not guarantee iframe compatibility. Test on real iOS Safari and Android Chrome before publishing; do not claim the embedding is reliable before these checks.
- Completed visits, cancellations and revenue require a separate CRM attribution setup; installing a counter alone does not provide those reports.

Official instructions:
- https://support.yclients.ru/32-37-254--ustanovka-formy-onlajn-zapisi-vnutri-odnoj-iz-stranic-sajta/
- https://support.yclients.ru/32-40-312--integraciya-s-yandeks-metrikoj/
