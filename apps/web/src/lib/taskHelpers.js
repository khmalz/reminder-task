// src/features/tasks/utils/taskHelpers.js

export const parseTaskCategories = task => {
   return (
      task.categoryToTasks?.reduce(
         (acc, item) => {
            const { title, typeName } = item.category || {};
            if (typeName === "TASK_KIND") acc.kind = title;
            if (typeName === "TASK_TYPE") acc.type = title;
            if (typeName === "TASK_COLLECTION") acc.collection = title;
            return acc;
         },
         { kind: "-", type: "-", collection: "-" },
      ) || { kind: "-", type: "-", collection: "-" }
   );
};
