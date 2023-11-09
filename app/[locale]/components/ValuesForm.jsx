"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const numbersRegex = /^(?:[0-9]+)?$/;

const formSchema = z.object({
  capacity: z
    .string({ required_error: "This field can't be empty" })
    .min(1, { message: "This field can't be empty" })
    .regex(numbersRegex, { message: "Vous devez entrer un nombre valide" }),
  nbrObject: z
    .string({ required_error: "This field can't be empty" })
    .min(1, { message: "This field can't be empty" })
    .regex(numbersRegex, { message: "Vous devez entrer un nombre valide" }),
  valeurs: z
    .array(
      z
        .string()
        .regex(numbersRegex, { message: "Vous devez entrer un nombre valide" })
        .optional()
    )
    .optional(),
  poids: z
    .array(
      z
        .string()
        .regex(numbersRegex, { message: "Vous devez entrer un nombre valide" })
        .optional()
    )
    .optional(),
});

const ValuesForm = ({ setResult }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      capacity: "",
      nbrObject: "",
      valeurs: Array(100).fill(""),
      poids: Array(100).fill(""),
    },
  });

  const numberOfInputs = parseInt(form.watch().nbrObject) || 0;
  const inputFields = Array.from({ length: numberOfInputs }, (_, index) => (
    <div className="grid grid-cols-1 gap-[5%] md:grid-cols-2" key={index}>
      <FormField
        control={form.control}
        name={`valeurs[${index}]`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{`Valeur d'objet ${index + 1}`}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`poids[${index}]`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{`Poids d'objet ${index + 1}`}</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  ));

  const verifyNecessaryFieldsIfEmpty = () => {
    const nbrObject = form.watch().nbrObject;
    const capacity = form.watch().capacity;

    const valeurs = form.watch().valeurs.slice(0, nbrObject);
    const poids = form.watch().poids.slice(0, nbrObject);

    if (!nbrObject.length || nbrObject.trim() === "0") {
      return true;
    }

    if (!capacity.length) {
      return true;
    }

    if (!poids.length || !valeurs.length) {
      return true;
    }

    const emptyPoids = poids.some((poids) => poids.length === 0);
    const emptyValeurs = valeurs.some((valeur) => valeur.length === 0);

    return emptyPoids || emptyValeurs;
  };

  const knapsack = (capacity, valeurs, poids) => {
    const n = valeurs.length;
    const dp = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));
    const selectedObjects = [];

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (poids[i - 1] <= w) {
          dp[i][w] = Math.max(
            valeurs[i - 1] + dp[i - 1][w - poids[i - 1]],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    let res = dp[n][capacity];
    let w = capacity;
    for (let i = n; i > 0 && res > 0; i--) {
      if (res !== dp[i - 1][w]) {
        selectedObjects.push(i - 1);
        res -= valeurs[i - 1];
        w -= poids[i - 1];
      }
    }

    return { maxValue: dp[n][capacity], selectedObjects };
  };

  function onSubmit(values) {
    const inputsToValidate = {
      capacity: parseInt(values.capacity),
      nbrObject: parseInt(values.nbrObject),
      valeurs: values.valeurs
        .slice(0, values.nbrObject)
        .map((value) => parseInt(value)),
      poids: values.poids
        .slice(0, values.nbrObject)
        .map((poids) => parseInt(poids)),
    };

    const { capacity, valeurs, poids } = inputsToValidate;
    const result = knapsack(capacity, valeurs, poids);

    setResult(result);
  }
  return (
    <div className="px-[5%]">
      <h1 className="text-3xl font-bold text-center mb-[5%]">
        Calculateur du Knapsack
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => {
            setResult((prev) => (!verifyNecessaryFieldsIfEmpty ? prev : null));
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-[5%] md:grid-cols-2">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacité du sac</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nbrObject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d'objets</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {inputFields}
          <div className="w-full flex justify-end">
            <Button disabled={verifyNecessaryFieldsIfEmpty()} type="submit">
              Calculer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ValuesForm;
