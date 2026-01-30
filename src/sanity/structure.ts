import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Bảng điều khiển")
    .items([
      // Course Content
      S.listItem()
        .title("Quản lý khóa học")
        .child(
          S.documentTypeList("course")
            .title("Các khóa học")
            .child((courseId) =>
              S.list()
                .title("Các lựa chọn")
                .items([
                  // Option to edit course content
                  S.listItem()
                    .title("Chỉnh sửa thông tin khóa học")
                    .child(
                      S.document().schemaType("course").documentId(courseId)
                    ),
                  // Option to view course enrollments
                  S.listItem()
                    .title("Xem thông tin học viên")
                    .child(
                      S.documentList()
                        .title("Course Enrollments")
                        .filter(
                          '_type == "enrollment" && course._ref == $courseId'
                        )
                        .params({ courseId })
                    ),
                ])
            )
        ),

      S.divider(),

      // Users
      S.listItem()
        .title("Quản lý người dùng")
        .child(
          S.list()
            .title("Chọn loại người dùng")
            .items([
              // Instructors with options
              S.listItem()
                .title("Giảng viên")
                .schemaType("instructor")
                .child(
                  S.documentTypeList("instructor")
                    .title("Giảng viên")
                    .child((instructorId) =>
                      S.list()
                        .title("Instructor Options")
                        .items([
                          // Option to edit instructor details
                          S.listItem()
                            .title("Chỉnh sửa thông tin giảng viên")
                            .child(
                              S.document()
                                .schemaType("instructor")
                                .documentId(instructorId)
                            ),
                          // Option to view instructor's courses
                          S.listItem()
                            .title("Xem các khóa học của giảng viên")
                            .child(
                              S.documentList()
                                .title("Instructor's Courses")
                                .filter(
                                  '_type == "course" && instructor._ref == $instructorId'
                                )
                                .params({ instructorId })
                            ),
                        ])
                    )
                ),
              // Students with options
              S.listItem()
                .title("Học viên")
                .schemaType("student")
                .child(
                  S.documentTypeList("student")
                    .title("Học viên")
                    .child((studentId) =>
                      S.list()
                        .title("Student Options")
                        .items([
                          // Option to edit student details
                          S.listItem()
                            .title("Chỉnh sửa thông tin học viên")
                            .child(
                              S.document()
                                .schemaType("student")
                                .documentId(studentId)
                            ),
                          // Option to view enrollments
                          S.listItem()
                            .title("Xem lịch sử ghi danh")
                            .child(
                              S.documentList()
                                .title("Xem lịch sử ghi danh")
                                .filter(
                                  '_type == "enrollment" && student._ref == $studentId'
                                )
                                .params({ studentId })
                            ),
                          // Option to view completed lessons
                          S.listItem()
                            .title("Xem các bài học đã hoàn thành")
                            .child(
                              S.documentList()
                                .title("Các bài học đã hoàn thành")
                                .schemaType("lessonCompletion")
                                .filter(
                                  '_type == "lessonCompletion" && student._ref == $studentId'
                                )
                                .params({ studentId })
                                .defaultOrdering([
                                  { field: "completedAt", direction: "desc" },
                                ])
                            ),
                        ])
                    )
                ),
            ])
        ),

      S.divider(),

      // System Management
      S.listItem()
        .title("Quản lý hệ thống")
        .child(
          S.list()
            .title("System Management")
            .items([S.documentTypeListItem("category").title("Phân loại khóa học")])
        ),
    ]);
