import { GetRecipeResponse } from "@common/miamTypes";
import { Paths } from "@src/lib/constants";
import { getRecipeKindProperties } from "@src/lib/tools";
import { Pencil } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { Button } from "./ui/button";

// Display a line of text
function Line({ text, className }: { text: string; className?: string }) {
  text = text.trim();
  //if no text (means line break) set a non-breaking space to for line to be displayed
  if (!text || text === ".") {
    return <li dangerouslySetInnerHTML={{ __html: "&nbsp" }} />;
  }

  if (text.startsWith("#")) {
    return <li className="ml-2 font-bold">{text.substring(1).trim()}</li>;
  }

  if (text.startsWith("-")) {
    text = text.substring(1).trim();
  }
  return <li className={`ml-8 list-disc ${className || ""}`}>{text}</li>;
}

export default function RecipePage() {
  const { recipe } = useLoaderData() as GetRecipeResponse;
  const { recipeId } = useParams();
  const { name, ingredients, steps, peopleNumber, imageDataUrl, kind } = recipe || {};
  const { Icon } = getRecipeKindProperties(kind);
  return (
    <main className="recipe-page px-1 py-3">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center text-primary-600">
          <Icon size={24} />
          <span className="text-2xl font-medium">{name}</span>
        </div>
        <Button size="icon" className="bg-primary-700 ">
          <Link to={`${Paths.Recipes}/${recipeId}/update`} className="text-[20px] p-5">
            <Pencil />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col justify-between gap-2 pt-2">
        <div className="flex flex-col justify-between md:flex-row-reverse">
          {imageDataUrl ? (
            <div className="flex items-center justify-center md:basis-1/2 md:items-start">
              <img src={imageDataUrl} alt="recipe" className="rounded-3xl shadow-lg h-[200px] md:h-auto" />
            </div>
          ) : (
            <div />
          )}

          <div>
            <div className="text-2xl font-medium pt-3 md:pt-0">
              Ingrédients
              {!!peopleNumber && <span>(pour {peopleNumber} personnes)</span>}
            </div>
            <ul>
              {ingredients?.split(/\r?\n/).map((ingredient, i) => (
                <Line key={`${ingredient}-${i}`} text={ingredient} />
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="text-2xl font-medium pt-4">Préparation</div>
          <ul>
            {steps?.split(/\r?\n/).map((step) => (
              <Line key={`${step}`} text={step} className="pb-4" />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
