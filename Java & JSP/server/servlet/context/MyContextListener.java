package servlet.context;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import community.entity.Board;
import net.FirebaseSender;

@WebListener
public class MyContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		FirebaseSender.destroy();
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		Board.load();
	}

}