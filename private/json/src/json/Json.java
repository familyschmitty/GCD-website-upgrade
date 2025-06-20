package json;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import javax.script.*;

public class Json
{
   public static void main(String[] args) throws Exception
   {
      // create a script engine manager
      ScriptEngineManager factory = new ScriptEngineManager();
      // create JavaScript engine
      ScriptEngine engine = factory.getEngineByName("JavaScript");

      String wrappedScript = "var data = %s; var result = JSON.stringify(data);";

      StringBuilder builder = new StringBuilder();
      Path scriptFilePath = Paths.get(args[0]);
      try (BufferedReader reader = Files.newBufferedReader(scriptFilePath, StandardCharsets.UTF_8))
      {
         String line;
         while ((line = reader.readLine()) != null)
         {
            builder.append(line).append("\n");
         }
      }
      engine.eval(String.format(wrappedScript, builder));
      StringBuilder jsonFileName = new StringBuilder();
      int ext = args[0].lastIndexOf(".");
      if (ext > -1)
      {
         jsonFileName.append(args[0].substring(0, ext));
      }
      else
      {
         jsonFileName.append(args[0]);
      }
      jsonFileName.append(".json");
      
      Path jsonFilePath = Paths.get(jsonFileName.toString());
      try (BufferedWriter writer = Files.newBufferedWriter(jsonFilePath, StandardCharsets.UTF_8,
               StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE))
      {
         writer.write(engine.get("result").toString());
      }
   }
}
