import {
  getAllChecklistItems,
  insertOneCategory,
  insertOneItem,
  insertOneList,
} from "../../src/features/checklist/checklistDb";

(async function () {
  try {
    const listId = await insertOneList({ title: "Carrefour" });
    const categoryId = await insertOneCategory({
      title: "Entretien/Bazar",
      listId,
    });

    await insertOneItem({
      title: "My first item",
      subtitle: "sub",
      categoryId,
      checkStatus: 0,
    });
    await insertOneItem({
      title: "My 2nd item",
      subtitle: "sub sub",
      categoryId,
      checkStatus: 0,
    });
    await insertOneItem({
      title: "My 3rd item",
      subtitle: "sub sub sub",
      categoryId,
      checkStatus: 0,
    });

    const rows = await getAllChecklistItems();
    console.log("rows", rows);
  } catch (error) {
    console.error("Error", error);
  }
})();
