from pathlib import Path

path = Path("src/app/page.js")
text = path.read_text(encoding="utf-8")
block = "          </div>\n\n          <div className=\"space-y-2\">\n            <label className=\"block text-sm font-medium text-fg-primary\" htmlFor=\"projectStage\">"
if "htmlFor=\"teamSize\"" not in text:
    team_field = "          </div>\n\n          <div className=\"space-y-2\">\n            <label className=\"block text-sm font-medium text-fg-primary\" htmlFor=\"teamSize\">\n              Team size\n            </label>\n            <input\n              id=\"teamSize\"\n              type=\"number\"\n              min={1}\n              className=\"w-full rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3 text-base text-fg-primary outline-none transition focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-ring\"\n              placeholder=\"e.g. 8\"\n              {...register(\"teamSize\", {\n                required: \"Enter your current team size.\",\n                validate: (value) => {\n                  const parsed = Number(value);\n                  if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {\n                    return \"Provide a whole number greater than zero.\";\n                  }\n                  return true;\n                },\n              })}\n            />\n            {errors.teamSize && (\n              <p className=\"text-sm text-red-400\">{errors.teamSize.message}</p>\n            )}\n          </div>\n\n          <div className=\"space-y-2\">\n            <label className=\"block text-sm font-medium text-fg-primary\" htmlFor=\"projectStage\">"
    text = text.replace(block, team_field)
path.write_text(text, encoding="utf-8")
