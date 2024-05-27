import { RecipeInput, RecipeKind, RecipeRow } from "@common/miamTypes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { addOneRecipe, updateOneRecipe } from "@src/lib/api";
import convertFileToImageDataUrl from "@src/lib/convertFileToImageDataUrl";
import { getLabelFromRecipeKind } from "@src/lib/tools";
import { Trash2 } from "lucide-react";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paths } from "../lib/constants";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

function buildRecipeInput(formData: FormData): RecipeInput {
  const peopleNumberStr = formData.get("peopleNumber")?.toString() || "";
  const idStr = formData.get("recipeId")?.toString() || "";
  return {
    name: formData.get("name")?.toString() || "",
    kind: parseInt(formData.get("kind")?.toString() || String(RecipeKind.Course)),
    peopleNumber: peopleNumberStr ? parseInt(peopleNumberStr) : undefined,
    ingredients: formData.get("ingredients")?.toString() || "",
    steps: formData.get("steps")?.toString() || "",
    imageDataUrl: formData.get("imageDataUrl")?.toString() || "",
    ...(idStr && { id: parseInt(idStr) }),
  };
}
interface RecipeEditorProps {
  recipe?: RecipeRow;
}

export default function RecipeEditor({ recipe }: RecipeEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageDataUrl, setCurrentImageDataUrl] = useState<string>(recipe?.imageDataUrl || "");
  const [currentKind, setCurrentKind] = useState<RecipeKind>(recipe?.kind || RecipeKind.Course);
  const navigate = useNavigate();

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const imageDataUrl = await convertFileToImageDataUrl(e.target.files?.[0]);
    setCurrentImageDataUrl(imageDataUrl);
  }, []);

  const handleSelectKindChange = useCallback((kind: string) => {
    setCurrentKind(parseInt(kind, 10));
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    try {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      formData.set("kind", String(currentKind) || String(RecipeKind.Course));

      if (recipe) {
        formData.set("recipeId", String(recipe.id));
        await updateOneRecipe(recipe.id, buildRecipeInput(formData));
        navigate(`${Paths.Recipes}/${recipe.id}`);
      } else {
        await addOneRecipe(buildRecipeInput(formData));
        navigate(Paths.Recipes);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleDeleteImageClick = useCallback(() => {
    setCurrentImageDataUrl("");
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleResetClick = useCallback(() => {
    setCurrentImageDataUrl("");
    if (recipe) {
      navigate(`${Paths.Recipes}/${recipe.id}`);
    } else {
      navigate(Paths.Recipes);
    }
  }, [recipe, navigate]);

  console.log("***ju***RecipeEditor.tsx/88", String(currentKind));
  return (
    <main className="py-3">
      <form onSubmit={handleFormSubmit} action="">
        <input type="hidden" id="recipeId" name="recipeId" value={recipe?.id} />
        <div className="flex items-center gap-2 py-2">
          <Label htmlFor="name" className="font-bold">
            Recette:
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            minLength={5}
            maxLength={50}
            placeholder=""
            spellCheck={true}
            required
            defaultValue={recipe?.name}
            className="w-1/2"
          />
        </div>

        <div className="flex items-center justify-start gap-10">
          <div className="flex items-center gap-2 py-2">
            <Label className="font-bold">Type:</Label>
            <Select onValueChange={handleSelectKindChange} value={String(currentKind)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(RecipeKind)
                    .filter((kind) => !isNaN(Number(kind)))
                    .map((kind) => (
                      <SelectItem key={String(kind)} value={String(kind)}>
                        {getLabelFromRecipeKind(kind as RecipeKind)}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 py-2">
            <Label htmlFor="peopleNumber" className="font-bold">
              Nb personnes:
            </Label>
            <Input
              id="peopleNumber"
              name="peopleNumber"
              type="number"
              min={0}
              max={15}
              placeholder=""
              defaultValue={recipe?.peopleNumber}
              className="w-[80px]"
            />
          </div>
        </div>
        <div className="py-2">
          <Label htmlFor="ingredients" className="font-bold">
            Ingrédients:
          </Label>
          <Textarea
            id="ingredients"
            name="ingredients"
            rows={15}
            minLength={30}
            placeholder=""
            spellCheck={true}
            required
            defaultValue={recipe?.ingredients}
          ></Textarea>
        </div>
        <div className="py-2">
          <Label htmlFor="steps" className="font-bold">
            Préparation:
          </Label>
          <Textarea
            id="steps"
            name="steps"
            rows={20}
            minLength={30}
            placeholder=""
            spellCheck={true}
            required
            defaultValue={recipe?.steps}
          ></Textarea>
        </div>

        <Label htmlFor="imgFile" className="pt-2 font-bold">
          Image:
        </Label>
        <div className="flex gap-3">
          {currentImageDataUrl && <img src={currentImageDataUrl} alt="recipe" className="w-[50%]" />}

          <div className="flex flex-col gap-2 items-start">
            <Input
              type="file"
              ref={fileInputRef}
              id="imgFile"
              name="imgFile"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {currentImageDataUrl && (
              <Button size="icon" onClick={handleDeleteImageClick}>
                <Trash2 />
              </Button>
            )}
          </div>

          <input type="hidden" id="imageDataUrl" name="imageDataUrl" defaultValue={currentImageDataUrl} />
        </div>

        <div className="flex gap-4 pt-5">
          <Button type="submit" color="success" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {recipe ? "Appliquer les modifications" : "Ajouter la recette"}
          </Button>
          <Button type="reset" color="failure" onClick={handleResetClick}>
            Annuler
          </Button>
        </div>
      </form>
    </main>
  );
}
