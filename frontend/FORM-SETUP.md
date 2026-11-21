# FormSubmit setup

Both the homepage admission form and the Contact page form submit directly to
FormSubmit's AJAX endpoint:

```text
https://formsubmit.co/ajax/<VITE_FORMSUBMIT_EMAIL>
```

Set these variables in the **production** environment before building:

```env
VITE_WORDPRESS_URL=https://admin.vidyaacademy.school.in/
VITE_FORMSUBMIT_EMAIL=your-real-primary-email@example.com
VITE_FORMSUBMIT_CC=real-second-email@example.com,real-third-email@example.com
```

The primary address must be a real email address. CC values are optional and
must also be real addresses. The code filters invalid/example CC values so they
cannot break the request.

The request includes an absolute `_url` generated from the hosted page's origin
and path. This prevents FormSubmit from treating the request as a local
`file://` page. Run the site through Vite, a preview server, or production; do
not double-click `dist/index.html`.

FormSubmit sends one activation email the first time a new primary address is
used. Activate it once, then future submissions go to that mailbox. Since this
frontend uses FormSubmit directly, the WordPress enquiry route is not used for
form delivery.
