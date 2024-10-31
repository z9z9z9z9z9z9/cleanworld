import fs from "fs";
import path from "path";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { name, last_name, country } = req.body;
  const results = [];
  const dataDir = path.join(process.cwd(), "data");
  const folders = fs.readdirSync(dataDir);

  folders.forEach(folder => {
    const folderPath = path.join(dataDir, folder);
    const infoPath = path.join(folderPath, "info.txt");

    // Look for image files with common extensions
    const imageFile = fs.readdirSync(folderPath).find(file => /\.(png|jpg|jpeg)$/i.test(file));

    if (fs.existsSync(infoPath) && imageFile) {
      const infoData = fs.readFileSync(infoPath, "utf8");
      const [personName, personLastName, personAge, personCountry] = infoData.split("\n").map(line => line.split(": ")[1]);

      // Check if any fields match the search criteria
      if (
        (!name || name.toLowerCase() === personName.toLowerCase()) &&
        (!last_name || last_name.toLowerCase() === personLastName.toLowerCase()) &&
        (!country || country.toLowerCase() === personCountry.toLowerCase())
      ) {
        results.push({
          photo_url: `/data/${folder}/${imageFile}`,
          name: personName,
          last_name: personLastName,
          age: personAge,
          country: personCountry
        });
      }
    }
  });

  res.status(200).json({ matches: results });
};
