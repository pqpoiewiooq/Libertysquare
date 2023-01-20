package util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import community.entity.Board;
import data.Bank;

public class JsonUtil {
	private static Gson gson = new GsonBuilder()
			.registerTypeAdapter(Bank.class, new TypeAdapter<Bank>() {
				@Override
				public Bank read(JsonReader reader) throws IOException {
					Bank bank = null;
					if (reader.hasNext()) {
						reader.peek();
						bank = Bank.from(reader.nextInt());
					}
					
					return bank;
				}

				@Override
				public void write(JsonWriter writer, Bank bank) throws IOException {
					if(bank == null) writer.nullValue();
					else writer.value(bank.code());
				}
			})
			.registerTypeAdapter(Board.class, new TypeAdapter<Board>() {
				@Override
				public Board read(JsonReader reader) throws IOException {
					Board board = null;
					if (reader.hasNext()) {
						reader.peek();
						board = Board.ordinalOf(reader.nextInt());
					}
					
					return board;
				}

				@Override
				public void write(JsonWriter writer, Board board) throws IOException {
					if(board == null) writer.nullValue();
					else writer.value(board.ko());
				}
			})
			.registerTypeAdapter(LocalDateTime.class, new TypeAdapter<LocalDateTime>() {
				public final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateUtil.DEFAULT_DATE_FORMAT);
				
				@Override
				public LocalDateTime read(JsonReader reader) throws IOException {
					LocalDateTime ldt = null;
					if (reader.hasNext()) {
						reader.peek();
						ldt = LocalDateTime.parse(reader.nextString(), formatter);
					}
					
					return ldt;
				}

				@Override
				public void write(JsonWriter writer, LocalDateTime ldt) throws IOException {
					if(ldt == null) writer.nullValue();
					else writer.value(formatter.format(ldt));
				}
			})
			.create();
	
	private JsonUtil() {}
	
	public static String toJson(Object obj) {
		return gson.toJson(obj);
	}
	
	public static <T> T fromJson(String json, Class<T> clazz) {
		return gson.fromJson(json, clazz);
	}
	
	public static <T> T fromJson(String json, Type type) {
		return gson.fromJson(json, type);
	}
	
	public static JsonObject parseJsonObject(InputStream is) throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(is));

		String line = "";
		String result = "";

		while((line = br.readLine()) != null) {
			result += line;
		}
		
		JsonElement element = JsonParser.parseString(result);
		
		JsonObject obj = element.getAsJsonObject();
		br.close();
		
		return obj;
	}
}
