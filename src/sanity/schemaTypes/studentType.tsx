import { defineField, defineType } from "sanity";

export const studentType = defineType({
    name: "student",
    title: "Student",
    type: "document",
    fields: [
        defineField({
            name: "firstName",
            title: "First Name",
            type: "string",
        }),
        defineField({
            name: "lastName",
            title: "Last Name",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "clerkId",
            title: "Clerk User ID",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "imageUrl",
            title: "Profile Image URL",
            type: "url",
        }),
    ],
    preview: {
        select: {
            firstName: "firstName",
            lastName: "lastName",
            imageUrl: "imageUrl",
        },
        prepare({ firstName, lastName, imageUrl }) {
            const safeFirst = firstName
                ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
                : "";
            const safeLast = lastName
                ? lastName.charAt(0).toUpperCase() + lastName.slice(1)
                : "";
            return {
                title: `${safeFirst} ${safeLast}`.trim() || "Unnamed Student",
                media: imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${safeFirst} ${safeLast}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                ) : undefined,
            };
        },
    },
});
